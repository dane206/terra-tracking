<script id="00-terra-datalayer-api">
(function () {
  if (window.__terra_datalayer_api__) return;
  window.__terra_datalayer_api__ = true;

  window.dataLayer = window.dataLayer || [];

  window.terraPushEvent = function (eventName, payload) {
    var getId = (window.terraGetUUID && typeof window.terraGetUUID === "function")
      ? window.terraGetUUID
      : function () { return String(Date.now()); };

    var getTs = (window.terraNowIso && typeof window.terraNowIso === "function")
      ? window.terraNowIso
      : function () { return new Date().toISOString(); };

    var out = {
      event: String(eventName || ""),
      event_id: getId(),
      timestamp: getTs()
    };

    if (payload) {
      for (var k in payload) out[k] = payload[k];
    }

    window.dataLayer.push(out);
  };
})();
</script>
