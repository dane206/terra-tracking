/* Terra Raw Capture — Shopify Custom Pixel (DEV, 2026 LOCK)
   - emits canonical raw contract only
   - no aliases, no fallbacks
*/

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

analytics.subscribe("all_events", function (event, context) {
  try {
    fetch("https://pixel-ingest-dev-7ak5xlux7q-uc.a.run.app/track", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-terra-secret": "dev_secret_123"
      },
      body: JSON.stringify({
        context: context || null,
        event_id: uuidv4(),
        event_name: event.name,
        payload: event.data || null,
        session_key: null,
        session_start: null,
        source: "shopify_pixel",
        th_vid: null,
        timestamp: event.timestamp
      })
    });
  } catch (e) {}
});
