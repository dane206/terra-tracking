/* ============================================================
PARITY PLAYBOOK (DO THIS, NO THEORY):
1) Pick ONE contract (Terra wrapper) and ALWAYS send THAT.
2) Make DEV + PROD use THE SAME Shopify Custom Pixel code.
3) Only difference between DEV/PROD is ENDPOINT (and optionally a STORE_ID).

ACTION: Replace the ENTIRE Shopify Custom Pixel in DEV and PROD
with this exact code (paste once per store), and only edit ENDPOINTS.
============================================================ */

/* =========================
CONFIG (ONLY THING YOU EDIT PER ENV)
========================= */

const ENDPOINT_PROD = "https://YOUR-PROD-INGESTION/track";
const ENDPOINT_DEV  = "https://YOUR-DEV-INGESTION/track";

/* auto-select endpoint by hostname (edit hostname match) */
const ENDPOINT = (() => {
  const h = location.hostname || "";
  // dev store host example: terra-dev-plus-store.myshopify.com
  if (h.includes("terra-dev-plus-store")) return ENDPOINT_DEV;
  return ENDPOINT_PROD;
})();

const DATA_SOURCE = "shopify_custom_pixel";
const SCHEMA_VERSION = "terra_v1";

/* =========================
UTILS
========================= */

function getCookie(name) {
  try {
    const v = document.cookie.split("; ").find(x => x.startsWith(name + "="));
    return v ? decodeURIComponent(v.split("=").slice(1).join("=")) : "";
  } catch (_) { return ""; }
}

function uuidv4() {
  // good enough for event_id
  try {
    return crypto.randomUUID();
  } catch (_) {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

function postOne(ev) {
  try {
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(ev),
      keepalive: true
    });
  } catch (_) {}
}

function nowIso() { return new Date().toISOString(); }

function toNumMaybe(id) {
  if (id == null) return null;
  // Shopify sometimes uses numbers, sometimes gid:// strings
  if (typeof id === "number") return id;
  const s = String(id);
  const m = s.match(/(\d+)\s*$/);
  return m ? Number(m[1]) : null;
}

function pickIdentity() {
  // Use what you already set on checkout events if present; cookie bridge is fallback.
  // If you have your own cookies for th_vid/session_key, put them here.
  return {
    th_vid: getCookie("th_vid") || null,
    session_key: getCookie("session_key") || null,
    ga4_client_id: getCookie("terra_ga_cid") || null,
    ga4_session_id: getCookie("terra_ga_sid") || null,
    ga4_session_number: (() => {
      const v = getCookie("terra_ga_sn");
      return v ? Number(v) : null;
    })()
  };
}

/* =========================
CANONICAL TERRA WRAPPER
- THIS is the ONE SHAPE you store/use everywhere.
========================= */

function wrap(shopifyEventName, terraEventName, shopifyEventObj) {
  return {
    source: DATA_SOURCE,                 // consistent
    schema_version: SCHEMA_VERSION,      // helps you audit parity
    event_name: terraEventName,          // your canonical emitter name
    event_id: uuidv4(),
    event_time: shopifyEventObj?.timestamp || nowIso(),
    payload: {
      shopify_event: shopifyEventName,   // platform event
      ...pickIdentity(),                 // cookies/bridge
      // include raw shopify event (no loss) but inside ONE wrapper
      raw: shopifyEventObj
    }
  };
}

/* =========================
EXTRACT + NORMALIZE CHECKOUT DATA (for purchase + steps)
This keeps purchase fields consistent and avoids “two shapes”.
========================= */

function attachCheckoutFields(terraWrapped, shopifyEventObj) {
  const c = shopifyEventObj?.data?.checkout || null;
  if (!c) return terraWrapped;

  // unify checkout identifiers
  const checkoutToken = c.token || null;

  // order/customer fields (present on checkout_completed)
  const orderId = c.order?.id != null ? String(toNumMaybe(c.order.id)) : null;
  const customerId = c.order?.customer?.id != null ? String(toNumMaybe(c.order.customer.id)) : null;
  const isFirstOrder = typeof c.order?.customer?.isFirstOrder === "boolean" ? c.order.customer.isFirstOrder : null;

  // items normalize to your ecommerce.items[] shape
  const items = Array.isArray(c.lineItems) ? c.lineItems.map((li, idx) => {
    const v = li.variant || {};
    return {
      product_id: toNumMaybe(v.product?.id),
      variant_id: toNumMaybe(v.id),
      sku: v.sku || null,
      item_name: li.title || v.title || null,
      item_variant: v.title || null,
      price: Number(v.price?.amount ?? li.finalLinePrice?.amount ?? 0),
      quantity: Number(li.quantity ?? 1),
      index: idx,
      currency: c.currencyCode || null,
      item_category: v.product?.type || null,
      item_brand: v.product?.vendor || null
    };
  }) : [];

  const currency = c.currencyCode || null;
  const total = Number(c.totalPrice?.amount ?? 0);
  const shipping = Number(c.shippingLine?.price?.amount ?? 0);
  const tax = Number(c.totalTax?.amount ?? 0);

  // write into YOUR payload keys (matches your prod Terra shape)
  terraWrapped.payload.checkout_id = checkoutToken;      // one key everywhere
  terraWrapped.payload.order_id = orderId;
  terraWrapped.payload.customer_id = customerId;
  terraWrapped.payload.is_first_order = isFirstOrder;

  terraWrapped.payload.ecommerce = {
    currency,
    value: total,
    shipping,
    tax,
    items,
    transaction_id: orderId
  };

  return terraWrapped;
}

/* =========================
SUBSCRIPTIONS (ONE EMITTER PER EVENT)
Storefront events belong to GTM. Checkout events belong to this pixel.
So: ONLY subscribe to CHECKOUT events here.
========================= */

const CHECKOUT_EVENTS = {
  checkout_started: "terra_begin_checkout",
  checkout_shipping_info_submitted: "terra_add_shipping_info",
  payment_info_submitted: "terra_add_payment_info",
  checkout_completed: "terra_purchase"
};

// Shopify Customer Events API (custom pixel environment):
// analytics.subscribe('<event_name>', (event) => {...})

Object.keys(CHECKOUT_EVENTS).forEach((shopifyName) => {
  const terraName = CHECKOUT_EVENTS[shopifyName];

  analytics.subscribe(shopifyName, (event) => {
    // Always emit ONE Terra wrapper shape
    let wrapped = wrap(shopifyName, terraName, event);

    // Normalize checkout/order/customer/items into the same fields every time
    wrapped = attachCheckoutFields(wrapped, event);

    // Send single event (or you can send {events:[wrapped]} if your ingestion expects batch)
    postOne(wrapped);
  });
});
