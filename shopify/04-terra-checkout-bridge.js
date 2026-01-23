<script id="03-terra-checkout-bridge">
(function () {
  if (window.__terra_checkout_bridge_ran__) return;
  window.__terra_checkout_bridge_ran__ = true;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function pushToCart() {
    if (!window.terra_ctx) return;

    var ctx = window.terra_ctx;
    var attrs = {};

    // Identity
    if (ctx.th_vid) attrs.th_vid = ctx.th_vid;
    if (ctx.session_key) attrs.session_key = ctx.session_key;
    if (ctx.session_start) attrs.session_start = ctx.session_start;

    // GA4
    if (ctx.terra_ga_cid) attrs.terra_ga_cid = ctx.terra_ga_cid;
    if (ctx.terra_ga_sid) attrs.terra_ga_sid = ctx.terra_ga_sid;
    if (ctx.terra_ga_sn)  attrs.terra_ga_sn  = ctx.terra_ga_sn;

    // First touch
    if (ctx.terra_ft_source)   attrs.terra_ft_source   = ctx.terra_ft_source;
    if (ctx.terra_ft_medium)   attrs.terra_ft_medium   = ctx.terra_ft_medium;
    if (ctx.terra_ft_campaign) attrs.terra_ft_campaign = ctx.terra_ft_campaign;
    if (ctx.terra_ft_content)  attrs.terra_ft_content  = ctx.terra_ft_content;
    if (ctx.terra_ft_term)     attrs.terra_ft_term     = ctx.terra_ft_term;
    if (ctx.terra_ft_id)       attrs.terra_ft_id       = ctx.terra_ft_id;

    // Last touch
    if (ctx.terra_lt_source)   attrs.terra_lt_source   = ctx.terra_lt_source;
    if (ctx.terra_lt_medium)   attrs.terra_lt_medium   = ctx.terra_lt_medium;
    if (ctx.terra_lt_campaign) attrs.terra_lt_campaign = ctx.terra_lt_campaign;
    if (ctx.terra_lt_content)  attrs.terra_lt_content  = ctx.terra_lt_content;
    if (ctx.terra_lt_term)     attrs.terra_lt_term     = ctx.terra_lt_term;
    if (ctx.terra_lt_id)       attrs.terra_lt_id       = ctx.terra_lt_id;

    // Click IDs
    if (ctx.terra_gclid)   attrs.terra_gclid   = ctx.terra_gclid;
    if (ctx.terra_gbraid)  attrs.terra_gbraid  = ctx.terra_gbraid;
    if (ctx.terra_wbraid)  attrs.terra_wbraid  = ctx.terra_wbraid;
    if (ctx.terra_msclkid) attrs.terra_msclkid = ctx.terra_msclkid;
    if (ctx.terra_fbclid)  attrs.terra_fbclid  = ctx.terra_fbclid;
    if (ctx.terra_ttclid)  attrs.terra_ttclid  = ctx.terra_ttclid;

    // Nothing to send
    if (!Object.keys(attrs).length) return;

    fetch("/cart/update.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attributes: attrs })
    }).catch(function(){});
  }

  /* Run once on page load */
  ready(pushToCart);

  /* Guarantee just before checkout */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t) return;

    if (
      t.matches('[href*="/checkout"]') ||
      t.matches('button[name="checkout"]') ||
      (t.closest && t.closest('form[action*="/cart"] button[type="submit"]'))
    ) {
      pushToCart();
    }
  });

})();
</script>
