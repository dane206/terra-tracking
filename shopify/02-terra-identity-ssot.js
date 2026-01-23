<script id="02-terra-identity-ssot">
(function () {
  if (window.__terra_identity_ssot_ran__) return;
  window.__terra_identity_ssot_ran__ = true;

  window.dataLayer = window.dataLayer || [];

  /* =========================
     CONFIG
  ========================= */

  var CTX_VERSION = "2.0.0";
  var GA4_STREAM_COOKIE = "_ga_R5FWDRBNQS"; // change per env

  /* =========================
     HELPERS
  ========================= */

  function uuidv4() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = (c === "x") ? r : ((r & 3) | 8);
      return v.toString(16);
    });
  }

  function nowIso() { return new Date().toISOString(); }

  function getCookie(name) {
    var m = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\\[\\]\\\\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return m ? decodeURIComponent(m[1]) : null;
  }

  function setCookie(name, val, maxAgeSeconds) {
    if (!val) return;
    var p = [];
    p.push(name + "=" + encodeURIComponent(val));
    p.push("Path=/");
    p.push("Max-Age=" + maxAgeSeconds);
    p.push("SameSite=Lax");
    if (location.protocol === "https:") p.push("Secure");
    document.cookie = p.join("; ");
  }

  function getDeviceType() {
    var ua = (navigator.userAgent || "").toLowerCase();
    if (/iphone|android.*mobile/.test(ua)) return "mobile";
    if (/ipad|android/.test(ua)) return "tablet";
    return "desktop";
  }

  /* =========================
     GA4 COOKIE EXTRACTION
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
        var c = all[i].trim();
        if (c.indexOf(GA4_STREAM_COOKIE + "=") === 0) {
          var val = c.split("=")[1] || "";
          var mSid = val.match(/s(\d+)/);
          var mSn  = val.match(/o(\d+)/);
          if (mSid) setCookie("terra_ga_sid", mSid[1], 604800);
          if (mSn)  setCookie("terra_ga_sn",  mSn[1], 604800);
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
    setCookie("th_vid", th_vid, 63072000);
  }

  var session_key = sessionStorage.getItem("session_key");
  var session_start = sessionStorage.getItem("session_start");

  if (!session_key || !session_start) {
    session_key = uuidv4();
    session_start = nowIso();
    sessionStorage.setItem("session_key", session_key);
    sessionStorage.setItem("session_start", session_start);
  }

  /* =========================
     BUILD CONTEXT FROM COOKIES
  ========================= */

  var ctx = Object.freeze({
    ctx_version: CTX_VERSION,
    ctx_id: uuidv4(),
    device_type: getDeviceType(),

    th_vid: th_vid,
    session_key: session_key,
    session_start: session_start,

    terra_ga_cid: getCookie("terra_ga_cid"),
    terra_ga_sid: getCookie("terra_ga_sid"),
    terra_ga_sn:  getCookie("terra_ga_sn"),

    terra_ft_source:   getCookie("terra_ft_source"),
    terra_ft_medium:   getCookie("terra_ft_medium"),
    terra_ft_campaign: getCookie("terra_ft_campaign"),
    terra_ft_content:  getCookie("terra_ft_content"),
    terra_ft_term:     getCookie("terra_ft_term"),
    terra_ft_id:       getCookie("terra_ft_id"),

    terra_lt_source:   getCookie("terra_lt_source"),
    terra_lt_medium:   getCookie("terra_lt_medium"),
    terra_lt_campaign: getCookie("terra_lt_campaign"),
    terra_lt_content:  getCookie("terra_lt_content"),
    terra_lt_term:     getCookie("terra_lt_term"),
    terra_lt_id:       getCookie("terra_lt_id"),

    terra_gclid:   getCookie("terra_gclid"),
    terra_gbraid:  getCookie("terra_gbraid"),
    terra_wbraid:  getCookie("terra_wbraid"),
    terra_msclkid: getCookie("terra_msclkid"),
    terra_fbclid:  getCookie("terra_fbclid"),
    terra_ttclid:  getCookie("terra_ttclid")
  });

  window.terra_ctx = ctx;

  /* =========================
     IDENTITY READY EVENT
  ========================= */

  window.dataLayer.push({
    event: "terra_identity_ready",
    event_id: uuidv4(),
    timestamp: nowIso(),
    terra_ctx: ctx
  });

})();
</script>
