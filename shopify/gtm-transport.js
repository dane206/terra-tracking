<script id="00-terra-gtm-transport">
(function () {
  if (window.__terra_gtm_transport_ran__) return;
  window.__terra_gtm_transport_ran__ = true;

  window.dataLayer = window.dataLayer || [];

  // This must exist BEFORE any producer runs
  window.terraPushEvent = function (eventName, payload) {
    window.dataLayer = window.dataLayer || [];

    var id = (window.terraGetUUID && typeof window.terraGetUUID === "function")
      ? window.terraGetUUID()
      : String(Date.now());

    var ts = (window.terraNowIso && typeof window.terraNowIso === "function")
      ? window.terraNowIso()
      : new Date().toISOString();

    var out = {
      event: String(eventName || ""),
      event_id: id,
      timestamp: ts
    };

    if (payload) {
      for (var k in payload) out[k] = payload[k];
    }

    window.dataLayer.push(out);
  };

  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),
        dl=l!=='dataLayer' ? '&l='+l : '';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-KJ7PNVHR');
})();
</script>
