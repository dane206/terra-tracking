<script id="terra_view_promotion_producer">
(function () {
  if (window.__terra_view_promotion_email_ran) return;
  window.__terra_view_promotion_email_ran = true;

  if (!window.terraGetCTX || !window.terraPushEvent) return;

  function qp(name) {
    try {
      var s = (location.search || '').replace(/^\?/, '');
      if (!s) return '';
      var re = new RegExp('(?:^|&)' + name.replace(/([.*+?^${}()|[\]\\\/])/g, '\\$1') + '=([^&]+)');
      var m = s.match(re);
      return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
    } catch (e) { return ''; }
  }

  /* short, stable 8-char hash (FNV-1a 32-bit) */
  function hash8(s){
    try {
      s = String(s || '');
      var h = 2166136261;
      for (var i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
      }
      var hex = h.toString(16);
      return ('00000000' + hex).slice(-8);
    } catch (e) {
      return '00000000';
    }
  }

  /* read UTMs verbatim (no normalization, no guessing) */
  var utm_source   = qp('utm_source')   || '';
  var utm_medium   = qp('utm_medium')   || '';
  var utm_campaign = qp('utm_campaign') || '';
  var utm_content  = qp('utm_content')  || '';
  var utm_term     = qp('utm_term')     || '';
  var utm_id       = qp('utm_id')       || '';

  /* only fire promotion when source explicitly indicates `klaviyo` */
  if (utm_source.toLowerCase() !== 'klaviyo') return;

  /* once per session per exact campaign (reality-based) */
  var key =
    '__terra_view_promotion_fired' +
    (utm_source || 'na') + ':' +
    hash8(
      [
        utm_medium,
        utm_campaign,
        utm_content,
        utm_id
      ].join('|')
    );

  try {
    if (sessionStorage.getItem(key)) return;
  } catch (e) {}

  /* context */
  var ctx = window.terraGetCTX();
  var affiliation = "shopify_web_store";

  /* promotion fields = direct projection of UTMs */
  var promotion_id   = utm_source || '(not set)';
  var promotion_name = utm_medium || '(not set)';
  var creative_name  = utm_campaign || '(not set)';
  var creative_slot  = utm_content || '(not set)';

  window.terraPushEvent('view_promotion', {
    ecommerce: {
      items: [{
        promotion_id: promotion_id,
        promotion_name: promotion_name,
        creative_name: creative_name,
        creative_slot: creative_slot,
        affiliation: affiliation
      }]
    },
    /* raw UTMs (do not normalize) */
    utm_source: utm_source,
    utm_medium: utm_medium,
    utm_campaign: utm_campaign,
    utm_content: utm_content,
    utm_term: utm_term,
    utm_id: utm_id
  });

  try { sessionStorage.setItem(key, '1'); } catch (e) {}
})();
</script>
