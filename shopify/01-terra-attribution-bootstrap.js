{%- comment -%}
01-terra-attribution-bootstrap.liquid

Purpose:
- Capture UTMs + click IDs from the landing URL
- Persist FIRST touch (ft_*) for long-term attribution
- Persist LAST touch (lt_*) for “what drove this session”
- Write everything to cookies ONLY (no ctx dependency)

Cookie naming:
- terra_ft_source / terra_ft_medium / terra_ft_campaign / terra_ft_content / terra_ft_term / terra_ft_id
- terra_lt_source / terra_lt_medium / terra_lt_campaign / terra_lt_content / terra_lt_term / terra_lt_id
- terra_gclid / terra_gbraid / terra_wbraid / terra_msclkid / terra_fbclid / terra_ttclid
- terra_landing_page (optional)
- terra_referrer (optional)

This snippet MUST be rendered before 01-terra-identity-ssot so identity can read cookies into ctx.
{%- endcomment -%}

<script id="01-terra-attribution-bootstrap">
(function () {
  if (window.__terra_attribution_bootstrap_ran__) return;
  window.__terra_attribution_bootstrap_ran__ = true;

  window.dataLayer = window.dataLayer || [];

  /* =========================
     CONFIG
  ========================= */

  // First-touch retention: long-lived
  var FT_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years

  // Last-touch retention: shorter “session-ish” memory
  // (You can bump to 7 days if you want lt_* to survive longer.)
  var LT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

  // Click IDs: keep long-ish (helps offline matching later)
  var CLICK_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

  /* =========================
     HELPERS (ES5)
  ========================= */

  function nowIso() { return new Date().toISOString(); }

  function decodePlus(s) {
    try {
      return decodeURIComponent(String(s || "").replace(/\+/g, " "));
    } catch (_) {
      return String(s || "");
    }
  }

  function getCookie(name) {
    var m = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\\[\\]\\\\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return m ? decodeURIComponent(m[1]) : null;
  }

  function setCookie(name, val, maxAgeSeconds) {
    if (val === null || val === undefined) return;
    val = String(val);
    if (!val) return;

    var p = [];
    p.push(name + "=" + encodeURIComponent(val));
    p.push("Path=/");
    p.push("Max-Age=" + String(maxAgeSeconds));
    p.push("SameSite=Lax");
    if (location.protocol === "https:") p.push("Secure");
    document.cookie = p.join("; ");
  }

  function parseQuery(search) {
    var out = {};
    var s = String(search || "");
    if (!s) return out;
    if (s.charAt(0) === "?") s = s.slice(1);
    if (!s) return out;

    var parts = s.split("&");
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i];
      if (!kv) continue;

      var eq = kv.indexOf("=");
      var k = eq >= 0 ? kv.slice(0, eq) : kv;
      var v = eq >= 0 ? kv.slice(eq + 1) : "";

      k = decodePlus(k).toLowerCase();
      v = decodePlus(v);

      if (!k) continue;
      if (out[k] === undefined) out[k] = v;
    }
    return out;
  }

  function pick(q, key) {
    var v = q[key];
    if (v === undefined || v === null) return "";
    v = String(v);
    return v;
  }

  function anyNonEmpty(obj) {
    for (var k in obj) {
      if (obj.hasOwnProperty(k) && obj[k]) return true;
    }
    return false;
  }

  /* =========================
     READ URL PARAMS
  ========================= */

  var q = parseQuery(location.search);

  // UTMs (Google standard)
  var utm = {
    source:  pick(q, "utm_source"),
    medium:  pick(q, "utm_medium"),
    campaign: pick(q, "utm_campaign"),
    content: pick(q, "utm_content"),
    term:    pick(q, "utm_term"),
    id:      pick(q, "utm_id")
  };

  // Click IDs (add as needed)
  var click = {
    gclid:   pick(q, "gclid"),
    gbraid:  pick(q, "gbraid"),
    wbraid:  pick(q, "wbraid"),
    msclkid: pick(q, "msclkid"),
    fbclid:  pick(q, "fbclid"),
    ttclid:  pick(q, "ttclid") // TikTok
  };

  // Some platforms pass non-utm params; if you want, map them here
  // Example: "tw_source" etc — only do this if you actually use them.

  var hasUtm = anyNonEmpty(utm);
  var hasClick = anyNonEmpty(click);

  // If nothing attribution-related in URL, do nothing.
  if (!hasUtm && !hasClick) {
    // Still useful to store landing page/referrer once, if you want:
    // if (!getCookie("terra_landing_page")) setCookie("terra_landing_page", location.href, FT_MAX_AGE);
    return;
  }

  /* =========================
     WRITE CLICK ID COOKIES
  ========================= */

  if (click.gclid)   setCookie("terra_gclid",   click.gclid,   CLICK_MAX_AGE);
  if (click.gbraid)  setCookie("terra_gbraid",  click.gbraid,  CLICK_MAX_AGE);
  if (click.wbraid)  setCookie("terra_wbraid",  click.wbraid,  CLICK_MAX_AGE);
  if (click.msclkid) setCookie("terra_msclkid", click.msclkid, CLICK_MAX_AGE);
  if (click.fbclid)  setCookie("terra_fbclid",  click.fbclid,  CLICK_MAX_AGE);
  if (click.ttclid)  setCookie("terra_ttclid",  click.ttclid,  CLICK_MAX_AGE);

  /* =========================
     FIRST TOUCH (set only once)
  ========================= */

  // First-touch should only be written if not already set.
  // If you want “first touch per new visitor id”, tie this to th_vid later.
  if (hasUtm) {
    if (!getCookie("terra_ft_source") && utm.source)   setCookie("terra_ft_source", utm.source, FT_MAX_AGE);
    if (!getCookie("terra_ft_medium") && utm.medium)   setCookie("terra_ft_medium", utm.medium, FT_MAX_AGE);
    if (!getCookie("terra_ft_campaign") && utm.campaign) setCookie("terra_ft_campaign", utm.campaign, FT_MAX_AGE);
    if (!getCookie("terra_ft_content") && utm.content) setCookie("terra_ft_content", utm.content, FT_MAX_AGE);
    if (!getCookie("terra_ft_term") && utm.term)       setCookie("terra_ft_term", utm.term, FT_MAX_AGE);
    if (!getCookie("terra_ft_id") && utm.id)           setCookie("terra_ft_id", utm.id, FT_MAX_AGE);
  }

  /* =========================
     LAST TOUCH (overwrite on new attribution hit)
  ========================= */

  // Last-touch updates whenever a URL contains attribution params.
  // This is what you want when someone returns through a new campaign/ad.
  if (hasUtm) {
    if (utm.source)   setCookie("terra_lt_source", utm.source, LT_MAX_AGE);
    if (utm.medium)   setCookie("terra_lt_medium", utm.medium, LT_MAX_AGE);
    if (utm.campaign) setCookie("terra_lt_campaign", utm.campaign, LT_MAX_AGE);
    if (utm.content)  setCookie("terra_lt_content", utm.content, LT_MAX_AGE);
    if (utm.term)     setCookie("terra_lt_term", utm.term, LT_MAX_AGE);
    if (utm.id)       setCookie("terra_lt_id", utm.id, LT_MAX_AGE);
  }

  // Optional: store the landing page + referrer (first time only)
  if (!getCookie("terra_landing_page")) setCookie("terra_landing_page", location.href, FT_MAX_AGE);
  if (!getCookie("terra_referrer") && document.referrer) setCookie("terra_referrer", document.referrer, FT_MAX_AGE);

  /* =========================
     DATA LAYER (DEBUG ONLY)
     - This does NOT replace ctx.
     - It is just proof that parsing worked.
  ========================= */

  window.dataLayer.push({
    event: "attribution_bootstrap",
    timestamp: nowIso(),

    // UTMs observed in URL (current hit)
    utm_source: utm.source || "",
    utm_medium: utm.medium || "",
    utm_campaign: utm.campaign || "",
    utm_content: utm.content || "",
    utm_term: utm.term || "",
    utm_id: utm.id || "",

    // Click IDs observed in URL (current hit)
    gclid: click.gclid || "",
    gbraid: click.gbraid || "",
    wbraid: click.wbraid || "",
    msclkid: click.msclkid || "",
    fbclid: click.fbclid || "",
    ttclid: click.ttclid || ""
  });
})();
</script>
