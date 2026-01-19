<script id="terra_bootstrap_foundation">
(function () {

  /* ============================================================
     HARD GUARD
     - Ensures this bootstrap runs exactly once per page load
     - Prevents double dataLayer pollution if snippet is injected twice
  ============================================================ */

  if (window.__terra_bootstrap_ran) return;
  window.__terra_bootstrap_ran = true;

  /* Ensure dataLayer always exists before GTM or any pushes */
  window.dataLayer = window.dataLayer || [];

  /* ============================================================
     UTILITIES
     - Pure helpers only
     - Minimal side effects (cookie + storage helpers are isolated)
  ============================================================ */

  /* RFC4122 UUID v4 generator
     - Uses crypto.randomUUID when available
     - Deterministic fallback when unavailable
  */

  function getUUID() {
    try { return crypto.randomUUID(); } catch (e) {}
    var t = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return t.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = (c === 'x') ? r : ((r & 3) | 8);
      return v.toString(16);
    });
  }

  /* ISO-8601 timestamp in UTC (GA4/Ads/warehouse safe) */
  function getNowIso() { return new Date().toISOString(); }

  /* ISO week label: YYYY_Www (reporting/cohorting safe) */
  function getISOWeekLabel() {
    var d = new Date();
    var target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    var dayNr = target.getUTCDay();
    if (dayNr === 0) dayNr = 7;
    target.setUTCDate(target.getUTCDate() + 4 - dayNr);
    var yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
    var year = target.getUTCFullYear();
    var weekStr = String(weekNo).padStart(2,'0');
    return String(year) + '_W' + weekStr;
  }

  /* Device classifier (good enough for segmentation) */
  function getDeviceType() {
    var ua = (navigator.userAgent || '').toLowerCase();
    if (ua.indexOf('iphone') !== -1 || (ua.indexOf('android') !== -1 && ua.indexOf('mobile') !== -1)) return 'mobile';
    if (ua.indexOf('ipad') !== -1 || (ua.indexOf('android') !== -1 && ua.indexOf('mobile') === -1)) return 'tablet';
    return 'desktop';
  }

  /* Cookie read (escaped, never throws) */
  function getCookieValue(name) {
    try {
      var esc = name.replace(/([.*+?^${}()|[\]\\\/])/g, '\\$1');
      var m = document.cookie.match(new RegExp('(?:^|; )' + esc + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : '';
    } catch (e) { return ''; }
  }

  /* Cookie write helper (SameSite=Lax, Secure on HTTPS) */
  function setCookieValue(name, val, maxAgeSeconds, domainOpt) {
    try {
      var parts = [];
      parts.push(name + '=' + encodeURIComponent(val));
      parts.push('Path=/');
      if (maxAgeSeconds) parts.push('Max-Age=' + String(maxAgeSeconds));
      if (domainOpt) parts.push('Domain=' + domainOpt);
      parts.push('SameSite=Lax');
      if (location.protocol === 'https:') parts.push('Secure');
      document.cookie = parts.join('; ');
    } catch (e) {}
  }

  /* Safe storage helpers (private mode / blocked storage safe) */
  function safeSSget(k) { try { return sessionStorage.getItem(k); } catch(e){ return null; } }
  function safeSSset(k,v){ try { sessionStorage.setItem(k,v); } catch(e){} }

  /* Page type resolver
     - Prefers ShopifyAnalytics.meta when present
     - Falls back to deterministic URL heuristics
     - Standardizes search_results naming now (do not revisit later)
  */

  function getPageType() {
    try {
      if (window.ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.page && ShopifyAnalytics.meta.page.pageType) {
        var pt = String(ShopifyAnalytics.meta.page.pageType || '');
        return pt;
      }
    } catch (e) {}

    var path = (location.pathname || '').toLowerCase();

    if (/\/(checkouts|orders)\/[^\/]+\/thank[_-]?you/.test(path)) return 'thank_you';
    if (/post-purchase/.test(path)) return 'post_purchase';
    if (/\/checkouts?/.test(path)) return 'checkout';
    if (/\/(cart|basket)/.test(path)) return 'cart';
    if (/\/products\//.test(path)) return 'product';

    if (/\/collections\//.test(path)) {
      if (path.indexOf('/search') !== -1) return 'search_results';
      return 'collection';
    }

    if (/\/pages\//.test(path)) return 'pages';

    if (/[?&](q|query|search)=/i.test(location.href)) return 'search_results';

    if (path === '/' || path === '') return 'home';
    return 'other';
  }

  /* Subdomain extractor (edu/blog/articles/www) */
  function getSubdomain(hostname){
    hostname = (hostname||'').toLowerCase();
    var parts = hostname.split('.');
    if(parts.length <= 1) return parts[0] || '';
    if(parts.length === 2) return 'www';
    return parts[0] || '';
  }

  /* Defensive cookie domain:
     - Uses last two labels (example.com)
     - Gives a cross-subdomain cookie on that base domain
     - This is intentionally simple; avoids environment branching
  */

  function getCookieBaseDomain(hostname){
    try {
      var parts = String(hostname || '').toLowerCase().split('.');
      if (parts.length < 2) return '';
      return '.' + parts.slice(-2).join('.');
    } catch (e) { return ''; }
  }

  /* Optional: Shopify env labeling (metadata only; do not branch behavior) */
  function getShopifyEnv(hostname){
    hostname = String(hostname || '').toLowerCase();
    if (hostname.indexOf('terra-dev-plus-store.myshopify.com') !== -1) return 'dev';
    if (hostname.indexOf('terrahealthessentials.com') !== -1) return 'live';
    if (hostname.indexOf('terra-health-essentials.myshopify.com') !== -1) return 'live';
    return 'unknown';
  }

  /* ============================================================
     IDENTITY + SESSION
  ============================================================ */

  var COOKIE_DOMAIN = getCookieBaseDomain(location.hostname);

  /* Visitor ID (2-year) */
  var th_vid = getCookieValue('th_vid');
  if (!th_vid) {
    th_vid = getUUID();
    setCookieValue('th_vid', th_vid, 60*60*24*365*2, COOKIE_DOMAIN);
  }
  window.th_vid = th_vid;

  /* Session identity (tab-scoped) */
  var session_key = safeSSget('session_key');
  var session_start = safeSSget('session_start');
  if (!session_key) {
    session_key = getUUID();
    session_start = getNowIso();
    safeSSset('session_key', session_key);
    safeSSset('session_start', session_start);
  }

  /* ============================================================
     CONTEXT OBJECT (CANONICAL SNAPSHOT)
     - Immutable by convention
     - Used by all downstream event producers
  ============================================================ */

  var page_type   = getPageType();
  var iso_week    = getISOWeekLabel();
  var device_type = getDeviceType();

  var ctx = {

    /* Contract metadata */
    ctx_version: '1.0.3',

    /* Correlation snapshot for this page load (NOT used as per-event ID) */
    ctx_id: getUUID(),
    ctx_timestamp: getNowIso(),
    ctx_shopify_env: getShopifyEnv(location.hostname),

    /* Shared basics */
    iso_week: iso_week,
    device_type: device_type,

    /* Identity */
    th_vid: th_vid,
    session_key: session_key,
    session_start: session_start,

    /* Page */
    page_hostname: location.hostname,
    page_location: location.href || '',
    page_path: location.pathname || '',
    page_title: document.title || location.pathname || '',
    page_type: page_type,
    page_subdomain: getSubdomain(location.hostname),

    /* Referrer */
    page_referrer: document.referrer || ''
  };

  /* Expose immutable context + helpers */
  window.terra_ctx = ctx;

  function getCTX(){ return window.terra_ctx; }

  try {
    /* Lock exports (prevents overwrites like window.terraGetUUID = ...) */
    Object.defineProperty(window, 'terraGetCTX', {
      value: getCTX, writable: false, configurable: false
    });
    Object.defineProperty(window, 'terraGetUUID', {
      value: getUUID, writable: false, configurable: false
    });
    Object.defineProperty(window, 'terraGetNowIso', {
      value: getNowIso, writable: false, configurable: false
    });
    Object.defineProperty(window, 'terraGetISOWeek', {
      value: getISOWeekLabel, writable: false, configurable: false
    });
  } catch (e) {

    /* Fallback if defineProperty fails */
    window.terraGetCTX = getCTX;
    window.terraGetUUID = getUUID;
    window.terraGetNowIso = getNowIso;
    window.terraGetISOWeek = getISOWeekLabel;
  }

  /* Defensive freeze (prevents accidental mutation of ctx fields) */
  try { Object.freeze(window.terra_ctx); } catch(e){}

  /* ============================================================
     EVENT PUSHER
     - Every event gets its own event_id (unique per event)
     - Every event carries full context (no temporal coupling)
  ============================================================ */

  function pushTerraVerb(verb){
    var ev = { event: verb };

    /* Copy full ctx onto event */
    for (var k in ctx) {
      if (ctx.hasOwnProperty(k)) ev[k] = ctx[k];
    }

    /* Per-event identity */
    ev.event_id = getUUID();      /* unique per event */
    ev.timestamp = getNowIso();   /* exact time per event emission */

    window.dataLayer.push(ev);

    if (window.console && console.log) {
      console.log('[terra-bootstrap]', verb, 'pushed', ev);
    }
  }

    /* ============================================================
     EXPORTED PUSH (for all producers)
     - Producers pass only event-specific payload
     - Bootstrap attaches ctx + event_id + timestamp
     - Consistent console output everywhere
  ============================================================ */

  function pushTerraEvent(verb, payload){
    var ev = { event: verb };

    /* Copy full ctx onto event */
    for (var k in ctx) {
      if (ctx.hasOwnProperty(k)) ev[k] = ctx[k];
    }

    /* Per-event identity */
    ev.event_id = getUUID();
    ev.timestamp = getNowIso();

    /* Merge event payload (ecommerce, etc.) */
    if (payload && typeof payload === 'object') {
      for (var p in payload) {
        if (payload.hasOwnProperty(p)) ev[p] = payload[p];
      }
    }

    window.dataLayer.push(ev);

    if (window.console && console.log) {
      console.log('[terra-producer]', verb, 'pushed', ev);
    }

    return ev;
  }

  try {
    Object.defineProperty(window, 'terraPushEvent', {
      value: pushTerraEvent, writable: false, configurable: false
    });
  } catch (e) {
    window.terraPushEvent = pushTerraEvent;
  }

  /* ============================================================
     BASELINE CONTEXT EVENTS (MINIMAL SET)
     - Fired once per page
     - No UTMs here
     - GA4 boundary will be `page_view` (via GTM later)
  ============================================================ */

  pushTerraVerb('terra_identity_ready');
  pushTerraVerb('terra_shopify_loaded');

  /* ============================================================
  ============================================================ */
  
  pushTerraVerb('page_view');

})();
</script>
