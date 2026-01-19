<script id="terra-identity-ssot">
(function () {
  if (window.__terra_identity_ssot_ran__) return;
  window.__terra_identity_ssot_ran__ = true;

  window.dataLayer = window.dataLayer || [];

  /* =========================
     VERSION (bump ONLY if ctx schema changes)
  ========================= */
  var CTX_VERSION = '1.0.7';

  /* =========================
     HELPERS
  ========================= */
  function uuidv4() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = (c === 'x') ? r : ((r & 3) | 8);
      return v.toString(16);
    });
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function getISOWeek() {
    var d = new Date();
    var t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    var day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    var y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    var w = Math.ceil((((t - y0) / 86400000) + 1) / 7);
    return t.getUTCFullYear() + '_W' + (w < 10 ? '0' + w : w);
  }

  function getDeviceType() {
    var ua = (navigator.userAgent || '').toLowerCase();
    if (/iphone|android.*mobile/.test(ua)) return 'mobile';
    if (/ipad|android/.test(ua)) return 'tablet';
    return 'desktop';
  }

  function norm(p) {
    p = (p || '/');
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    return p || '/';
  }

  function getCookie(name) {
    var m = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\\[\\]\\\\\/+^])/g,'\\$1') + '=([^;]*)')
    );
    return m ? decodeURIComponent(m[1]) : null;
  }

  function setCookie(name, val, maxAgeSeconds) {
    var p = [];
    p.push(name + '=' + encodeURIComponent(val));
    p.push('Path=/');
    p.push('Max-Age=' + maxAgeSeconds);
    p.push('SameSite=Lax');
    if (location.protocol === 'https:') p.push('Secure');
    document.cookie = p.join('; ');
  }

  /* =========================
     PAGE TYPE (CANONICAL + NORMALIZED)
     - Single source of truth
     - No subdomains
     - No handles
  ========================= */
  function normalizeShopifyPageType(pt) {
    pt = String(pt || '').toLowerCase();
    if (pt === 'search' || pt === 'searchresults' || pt === 'search_results') {
      return 'search_results';
    }
    if (pt === 'index') return 'home';
    return pt || null;
  }

  function getPageTypeFromPath(path) {
    path = norm(path || '/');

    if (/\/(checkouts|orders)\/[^/]+\/thank[-_]?you/i.test(path)) return 'thank_you';
    if (/post-purchase/i.test(path)) return 'post_purchase';

    if (/^\/cart(?:$|\/)/i.test(path)) return 'cart';
    if (/^\/products\/[^/]+$/i.test(path)) return 'product';
    if (/^\/collections\/[^/]+\/products\/[^/]+$/i.test(path)) return 'product';
    if (/^\/collections(?:$|\/)/i.test(path)) return 'collection';
    if (/^\/search(?:$|\/|\?)/i.test(path)) return 'search_results';

    if (path === '/' || path === '') return 'home';
    return 'page';
  }

  /* =========================
     VISITOR + SESSION
  ========================= */
  var th_vid = getCookie('th_vid');
  if (!th_vid) {
    th_vid = uuidv4();
    setCookie('th_vid', th_vid, 63072000); // 2 years
  }

  var session_key = sessionStorage.getItem('session_key');
  var session_start = sessionStorage.getItem('session_start');

  if (!session_key || !session_start) {
    session_key = uuidv4();
    session_start = nowIso();
    sessionStorage.setItem('session_key', session_key);
    sessionStorage.setItem('session_start', session_start);
  }

  try {
    localStorage.setItem('th_vid', th_vid);
    localStorage.setItem('session_key', session_key);
    localStorage.setItem('session_start', session_start);
  } catch (e) {}

  /* =========================
     CONTEXT OBJECT (AUTHORITATIVE)
  ========================= */
  var path = norm(location.pathname || '/');

  var shopifyPT =
    window.ShopifyAnalytics &&
    ShopifyAnalytics.meta &&
    ShopifyAnalytics.meta.page &&
    ShopifyAnalytics.meta.page.pageType;

  var page_type =
    normalizeShopifyPageType(shopifyPT) ||
    getPageTypeFromPath(path) ||
    'page';

  var ctx = Object.freeze({
    ctx_version: CTX_VERSION,
    ctx_id: uuidv4(),
    iso_week: getISOWeek(),
    device_type: getDeviceType(),

    th_vid: th_vid,
    session_key: session_key,
    session_start: session_start,

    page_hostname: location.hostname,
    page_location: location.href,
    page_path: path,
    page_title: document.title || '',
    page_referrer: document.referrer || '',

    page_type: page_type
  });

  window.terra_ctx = ctx;

  /* =========================
     PUBLIC API
  ========================= */
  window.terraGetUUID = uuidv4;
  window.terraNowIso  = nowIso;

  /* =========================
     IDENTITY EVENT (DATA LAYER ONLY)
     - Never sent to GA4 directly
  ========================= */
  window.dataLayer.push({
    event: 'terra_identity_ready',
    event_id: uuidv4(),
    timestamp: nowIso(),
    ctx_version: ctx.ctx_version,
    ctx_id: ctx.ctx_id,
    iso_week: ctx.iso_week,
    device_type: ctx.device_type,
    th_vid: ctx.th_vid,
    session_key: ctx.session_key,
    session_start: ctx.session_start,
    page_hostname: ctx.page_hostname,
    page_location: ctx.page_location,
    page_path: ctx.page_path,
    page_title: ctx.page_title,
    page_referrer: ctx.page_referrer,
    page_type: ctx.page_type
  });

  /* =========================
     PAGE VIEW (THEME ONLY)
     - Suppressed on thank_you + post_purchase
  ========================= */
  if (ctx.page_type !== 'thank_you' && ctx.page_type !== 'post_purchase') {
    window.dataLayer.push({
      event: 'page_view',
      event_id: uuidv4(),
      timestamp: nowIso(),
      ctx_version: ctx.ctx_version,
      ctx_id: ctx.ctx_id,
      iso_week: ctx.iso_week,
      device_type: ctx.device_type,
      th_vid: ctx.th_vid,
      session_key: ctx.session_key,
      session_start: ctx.session_start,
      page_hostname: ctx.page_hostname,
      page_location: ctx.page_location,
      page_path: ctx.page_path,
      page_title: ctx.page_title,
      page_referrer: ctx.page_referrer,
      page_type: ctx.page_type
    });
  }

})();
</script>
