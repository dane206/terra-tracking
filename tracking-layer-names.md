// Frozen Event Specification (v1)
** Three-Layer Model (final, no debate; no cross-pollination) **
** L1 - Storefront Intent → theme events only **
** L2 - Checkout Truth → Shopify Customer Events only **
** L3 - Warehouse Meaning → BigQuery transforms only **
// ✅ STEP 1 STATUS
a. Event spec v1 is now FROZEN.
b. Nothing else is being discussed until we complete: ➜ STEP 2
c. Lock the Shopify Customer Events pixel (all 6 checkout events, final code)

// L1 - Layer 1 — Storefront Intent (Theme)
** storefront events = customer intent before checkout, not ui action **
** controlled via shopify theme snippets **
** uses terra_ctx, item_utils **
** ga4 canonical; goes through gtm/dataLayer **
// ✅ Final storefront set approved (v1 frozen)
a. ✅ Keep page_view - all storefront pages; theme only
b. ✅ Keep view_item - product pages; 1 item
c. ✅ Keep view_item_list - collection, search; list context required
d. ✅ Keep add_to_cart - product pages; quantity supported
e. ✅ Keep search - search results pages; intent, not UI submit
// ❌ Explicitly Excluded
** reason: noise, not intent; not funnel-critical ***
a. clicked
b. form_submitted
c. input_focused
d. input_changed
e. input_blurred
f. cart_viewed
g. product_removed_from_cart

// L2 - Layer 2 — Checkout Truth (Shopify Customer Events Pixel)
** checkout events = use shopify checkout names verbatim **
** controlled via shopify customer events custom pixel **
** must be captured via analytics.subscribe and sent directly to ingestion **
** shopify canonical; raw is immutable **
2. ✅ Final checkout set (frozen v1 recommendation)
a. ✅ Keep checkout_started - required; entry point
b. ✳️ Add checkout_contact_info_submitted - required; email/phone captured
c. ✳️ Add checkout_address_info_submitted - required; address validation step
d. ✅ Keep checkout_shipping_info_submitted - required; shipping selected
e. ✅ Keep payment_info_submitted - required; payment attempted
f. ✅ Keep checkout_completed - required; order finalized
❌ Explicitly Excluded
** reason: non-deterministic, inconsistent; not reliable **
a. checkout_failed
b. checkout_error
c. checkout_step_viewed

// L3 - Layer 3 — Warehouse Derivations (BigQuery)
** events describe facts; tables answer questions **
** controlled via bigquery (stg/mart) **
** no guessing; no new events **
** happens in warehouse, never at source; only transforms Layer 1 + 2 **

// Payload Rules
** raw = entire shopify/theme payload **
** no flattening at ingest **
** no derived fields at ingest; no guessing missing fields **
** checkout token and order_id extracted later **
3. ✅ Final required event envelope
a. received_at     TIMESTAMP (server time)
b. event_id        STRING
c. event_name      STRING
d. event_time      TIMESTAMP (client time)
e. data_source     STRING
f. raw             JSON (UNMODIFIED)

// code

```
/* =========================
   Terra Checkout Pixel v1
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
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
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
```
