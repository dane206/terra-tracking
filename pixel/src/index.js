/* =========================
   Terra Custom Pixel v2
   ========================= */

const ENDPOINT = "https://pixel-ingest-dev-600339193870.us-central1.run.app/track";

function uuidv4() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === "x" ? r : (r & 3 | 8);
    return v.toString(16);
  });
}

function post(event_name, event) {
  try {
    browser.fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        data_source: "shopify_checkout_pixel",
        event_name: event_name,
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        raw: event
      })
    });
  } catch (_) {}
}

/* =========================
   Extra Events
   ========================= */

analytics.subscribe("search_submitted", function (event) {
  post("search_submitted", event);
});

analytics.subscribe("alert_displayed", function (event) {
  post("alert_displayed", event);
});

analytics.subscribe("ui_extension_errored", function (event) {
  post("ui_extension_errored", event);
});

analytics.subscribe("clicked", function (event) {
  post("clicked", event);
});

analytics.subscribe("form_submitted", function (event) {
  post("form_submitted", event);
});

analytics.subscribe("post_purchase_viewed", function (event) {
  post("post_purchase_viewed", event);
});

/* =========================
   Storefront Events
   ========================= */

analytics.subscribe("cart_viewed", function (event) {
  post("cart_viewed", event);
});

analytics.subscribe("collection_viewed", function (event) {
  post("collection_viewed", event);
});

analytics.subscribe("page_viewed", function (event) {
  post("page_viewed", event);
});

analytics.subscribe("product_added_to_cart", function (event) {
  post("product_added_to_cart", event);
});

analytics.subscribe("product_removed_from_cart", function (event) {
  post("product_removed_from_cart", event);
});

analytics.subscribe("product_viewed", function (event) {
  post("product_viewed", event);
});

/* =========================
   Checkout Funnel Events
   ========================= */

analytics.subscribe("checkout_started", function (event) {
  post("checkout_started", event);
});

analytics.subscribe("checkout_contact_info_submitted", function (event) {
  post("checkout_contact_info_submitted", event);
});

analytics.subscribe("checkout_address_info_submitted", function (event) {
  post("checkout_address_info_submitted", event);
});

analytics.subscribe("checkout_shipping_info_submitted", function (event) {
  post("checkout_shipping_info_submitted", event);
});

analytics.subscribe("payment_info_submitted", function (event) {
  post("payment_info_submitted", event);
});

analytics.subscribe("checkout_completed", function (event) {
  post("checkout_completed", event);
});
