<script id="02-terra-identity-ssot">
(function () {
  if (window.__terra_identity_ssot_ran__) return;
  window.__terra_identity_ssot_ran__ = true;

  window.dataLayer = window.dataLayer || [];

  /* =========================
     CONFIG
  ========================= */

  var CTX_VERSION = "2.0.0";
  // IMPORTANT: set this per environment (GA4 stream cookie name)
  // Example format: "_ga_<MEASUREMENT_ID_SUFFIX>"
  var GA4_STREAM_COOKIE = "_ga_R5FWDRBNQS";

  /* =========================
     HELPERS
  ========================= */

  function uuidv4() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = (c === "x") ? r : ((r & 3) | 8);
      return v.toString(16);
    });
  }

  function nowIso() { return new Date().toISOString(); }

  function safe(fn, fb) { try { return fn(); } catch (_) { return fb; } }

  function getISOWeek() {
    var d = new Date();
    var t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    var day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    var y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    var w = Math.ceil((((t - y0) / 86400000) + 1) / 7);
    return t.getUTCFullYear() + "_W" + (w < 10 ? "0" + w : w);
  }

  function normPath(p) {
    p = String(p || "/");
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
    return p || "/";
  }

  function getDeviceType() {
    var ua = (navigator.userAgent || "").toLowerCase();
    if (/iphone|android.*mobile/.test(ua)) return "mobile";
    if (/ipad|android/.test(ua)) return "tablet";
    return "desktop";
  }

  function getCookie(name) {
    var m = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\\[\\]\\\\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return m ? decodeURIComponent(m[1]) : null;
  }

  function setCookie(name, val, maxAgeSeconds) {
    if (val == null) return;
    var p = [];
    p.push(name + "=" + encodeURIComponent(String(val)));
    p.push("Path=/");
    p.push("Max-Age=" + Number(maxAgeSeconds || 0));
    p.push("SameSite=Lax");
    if (location.protocol === "https:") p.push("Secure");
    document.cookie = p.join("; ");
  }

  /* =========================
     GA4 COOKIE BRIDGE
     - _ga -> terra_ga_cid
     - _ga_<stream> -> terra_ga_sid, terra_ga_sn
  ========================= */

  (function () {
    try {
      var ga = getCookie("_ga");
      if (ga) {
        var parts = String(ga).split(".");
        if (parts.length >= 4) {
          setCookie("terra_ga_cid", parts[2] + "." + parts[3], 604800);
        }
      }

      var all = String(document.cookie || "").split(";");
      for (var i = 0; i < all.length; i++) {
        var c = (all[i] || "").replace(/^\s+|\s+$/g, "");
        if (c.indexOf(GA4_STREAM_COOKIE + "=") === 0) {
          var val = c.split("=").slice(1).join("=") || "";
          var mSid = val.match(/s(\d+)/);
          var mSn  = val.match(/o(\d+)/);
          if (mSid && mSid[1]) setCookie("terra_ga_sid", mSid[1], 604800);
          if (mSn  && mSn[1])  setCookie("terra_ga_sn",  mSn[1], 604800);
        }
      }
    } catch (_) {}
  })();

  /* =========================
     VISITOR + SESSION
  ========================= */

  var th_vid = getCookie("th_vid");
  if (!th_vid) {
    th_vid = uuidv4();
    setCookie("th_vid", th_vid, 63072000); // 2 years
  }

  var session_key = safe(function () { return sessionStorage.getItem("session_key"); }, null);
  var session_start = safe(function () { return sessionStorage.getItem("session_start"); }, null);

  if (!session_key || !session_start) {
    session_key = uuidv4();
    session_start = nowIso();
    safe(function () {
      sessionStorage.setItem("session_key", session_key);
      sessionStorage.setItem("session_start", session_start);
    }, null);
  }

  /* =========================
     BUILD CONTEXT (FROZEN)
  ========================= */

  var ga_sn = getCookie("terra_ga_sn");
  ga_sn = ga_sn ? Number(ga_sn) : null;

  var path = normPath(location.pathname || "/");

  var ctx = Object.freeze({
    ctx_version: CTX_VERSION,
    ctx_id: uuidv4(),
    iso_week: getISOWeek(),
    device_type: getDeviceType(),

    th_vid: th_vid,
    session_key: session_key,
    session_start: session_start,

    terra_ga_cid: getCookie("terra_ga_cid"),
    terra_ga_sid: getCookie("terra_ga_sid"),
    terra_ga_sn:  ga_sn,

    // attribution (stored as terra_* cookies; exposed as ft_*/lt_* on ctx)
    ft_source:   getCookie("terra_ft_source"),
    ft_medium:   getCookie("terra_ft_medium"),
    ft_campaign: getCookie("terra_ft_campaign"),
    ft_content:  getCookie("terra_ft_content"),
    ft_term:     getCookie("terra_ft_term"),
    ft_id:       getCookie("terra_ft_id"),

    lt_source:   getCookie("terra_lt_source"),
    lt_medium:   getCookie("terra_lt_medium"),
    lt_campaign: getCookie("terra_lt_campaign"),
    lt_content:  getCookie("terra_lt_content"),
    lt_term:     getCookie("terra_lt_term"),
    lt_id:       getCookie("terra_lt_id"),

    // click ids (stored as terra_* cookies; exposed unprefixed on ctx)
    gclid:   getCookie("terra_gclid"),
    gbraid:  getCookie("terra_gbraid"),
    wbraid:  getCookie("terra_wbraid"),
    msclkid: getCookie("terra_msclkid"),
    fbclid:  getCookie("terra_fbclid"),
    ttclid:  getCookie("terra_ttclid"),

    page_hostname: location.hostname,
    page_location: location.href,
    page_path: path,
    page_title: document.title || "",
    page_referrer: document.referrer || ""
  });

  window.terra_ctx = ctx;

  // Public getters (required by producers / transport)
  window.terraGetCTX = function () { return window.terra_ctx || null; };
  window.terraGetUUID = uuidv4;
  window.terraNowIso = nowIso;

  /* =========================
     EVENT EMISSION (FROZEN CONTRACT)
  ========================= */

  // terra_identity_ready (terra-prefixed fields for GTM lookups)
  window.dataLayer.push({
    event: "terra_identity_ready",
    event_id: uuidv4(),
    timestamp: nowIso(),

    ctx_version: ctx.ctx_version,
    ctx_id: ctx.ctx_id,
    iso_week: ctx.iso_week,
    device_type: ctx.device_type,

    th_vid: ctx.th_vid,
    session_key: ctx.session_key,
    session_start: ctx.session_start,

    terra_ga_cid: ctx.terra_ga_cid,
    terra_ga_sid: ctx.terra_ga_sid,
    terra_ga_sn:  ctx.terra_ga_sn,

    terra_ft_source: ctx.ft_source,
    terra_ft_medium: ctx.ft_medium,
    terra_ft_campaign: ctx.ft_campaign,
    terra_ft_content: ctx.ft_content,
    terra_ft_term: ctx.ft_term,
    terra_ft_id: ctx.ft_id,

    terra_lt_source: ctx.lt_source,
    terra_lt_medium: ctx.lt_medium,
    terra_lt_campaign: ctx.lt_campaign,
    terra_lt_content: ctx.lt_content,
    terra_lt_term: ctx.lt_term,
    terra_lt_id: ctx.lt_id,

    terra_gclid: ctx.gclid,
    terra_gbraid: ctx.gbraid,
    terra_wbraid: ctx.wbraid,
    terra_msclkid: ctx.msclkid,
    terra_fbclid: ctx.fbclid,
    terra_ttclid: ctx.ttclid,

    page_hostname: ctx.page_hostname,
    page_location: ctx.page_location,
    page_path: ctx.page_path,
    page_title: ctx.page_title,
    page_referrer: ctx.page_referrer
  });

  // page_view (terra-prefixed attribution + click ids preserved)
  window.dataLayer.push({
    event: "page_view",
    event_id: uuidv4(),
    timestamp: nowIso(),

    page_location: ctx.page_location,
    page_path: ctx.page_path,
    page_title: ctx.page_title,
    page_referrer: ctx.page_referrer,

    ctx_version: ctx.ctx_version,
    ctx_id: ctx.ctx_id,
    iso_week: ctx.iso_week,
    device_type: ctx.device_type,

    th_vid: ctx.th_vid,
    session_key: ctx.session_key,
    session_start: ctx.session_start,

    terra_ga_cid: ctx.terra_ga_cid,
    terra_ga_sid: ctx.terra_ga_sid,
    terra_ga_sn:  ctx.terra_ga_sn,

    terra_ft_source: ctx.ft_source,
    terra_ft_medium: ctx.ft_medium,
    terra_ft_campaign: ctx.ft_campaign,
    terra_ft_content: ctx.ft_content,
    terra_ft_term: ctx.ft_term,
    terra_ft_id: ctx.ft_id,

    terra_lt_source: ctx.lt_source,
    terra_lt_medium: ctx.lt_medium,
    terra_lt_campaign: ctx.lt_campaign,
    terra_lt_content: ctx.lt_content,
    terra_lt_term: ctx.lt_term,
    terra_lt_id: ctx.lt_id,

    terra_gclid: ctx.gclid,
    terra_gbraid: ctx.gbraid,
    terra_wbraid: ctx.wbraid,
    terra_msclkid: ctx.msclkid,
    terra_fbclid: ctx.fbclid,
    terra_ttclid: ctx.ttclid
  });

})();
</script>
