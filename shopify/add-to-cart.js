<script id="terra-add-to-cart-producer">
(function () {
  if (window.__terra_add_to_cart_ran__) return;
  window.__terra_add_to_cart_ran__ = true;

  if (!window.fetch ||
      !window.terra_ctx ||
      !window.terraGetUUID ||
      !window.terraNowIso ||
      !window.terraBuildCanonicalItem ||
      !window.terraValidateCanonicalItem) return;

  window.dataLayer = window.dataLayer || [];

  var ctx = window.terra_ctx;

  // Hook into Shopify cart add requests
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.action || form.action.indexOf('/cart/add') === -1) return;

    try {
      var fd = new FormData(form);
      var variant_id = Number(fd.get('id'));
      var quantity = Number(fd.get('quantity') || 1);

      if (!variant_id || quantity <= 0) return;

      // Fetch variant/product context from Shopify JS globals
      if (!window.Shopify || !Shopify.routes || !Shopify.routes.root) return;

      fetch(Shopify.routes.root + 'cart.js', { credentials: 'same-origin' })
        .then(function (r) { return r.json(); })
        .then(function (cart) {
          if (!cart || !cart.items) return;

          var line = null;
          for (var i = 0; i < cart.items.length; i++) {
            if (cart.items[i].variant_id === variant_id) {
              line = cart.items[i];
              break;
            }
          }
          if (!line) return;

          var price = Number(line.price) / 100;
          var currency = {{ shop.currency | json }};

          var item = window.terraBuildCanonicalItem({
            product_id: line.product_id,
            variant_id: line.variant_id,
            sku: line.sku || '',

            item_name: line.product_title || '',
            item_variant: line.variant_title || '',
            item_brand: line.vendor || '',
            item_category: line.product_type || '',

            price: price,
            quantity: quantity,
            currency: currency,

            affiliation: 'shopify_web_store'
          });

          var check = window.terraValidateCanonicalItem(item);
          if (!check.ok) {
            try { console.warn('[terra] add_to_cart invalid item', check.errors, item); } catch (e) {}
            return;
          }

          window.dataLayer.push({
            event: 'add_to_cart',
            event_id: window.terraGetUUID(),
            timestamp: window.terraNowIso(),

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

            ecommerce: {
              currency: currency,
              value: price * quantity,
              items: [item]
            }
          });
        })
        .catch(function () {});
    } catch (err) {}
  }, true);

})();
</script>
