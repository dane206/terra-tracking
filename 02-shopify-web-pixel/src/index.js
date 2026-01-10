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
