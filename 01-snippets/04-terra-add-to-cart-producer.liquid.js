<script id="terra_add_to_cart_producer">
(function () {
  if (window.__terra_add_to_cart_ran) return;
  window.__terra_add_to_cart_ran = true;

  if (!window.terraGetCTX || !window.terraPushEvent) return;

  var ctx = window.terraGetCTX();
  if (!ctx || ctx.page_type !== 'product') return;

  var variants = {{ product.variants | json }};

  function num(x, d){
    var n = Number(x);
    return isFinite(n) ? n : (d || 0);
  }

  function asInt(x, d){
    var n = parseInt(String(x || ''), 10);
    return isFinite(n) ? n : (d || 0);
  }

  function findVariant(id){
    for (var i = 0; i < variants.length; i++) {
      if (String(variants[i].id) === String(id)) return variants[i];
    }
    return null;
  }

  function isAddToCartForm(form){
    try {
      return String(form.action || '').indexOf('/cart/add') !== -1;
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('submit', function (e) {
    var form = e && e.target;
    if (!form || !isAddToCartForm(form)) return;

    /* prevent double-fire per submit */
    if (form.__terra_add_to_cart_fired) return;
    form.__terra_add_to_cart_fired = true;
    setTimeout(function(){
      try { form.__terra_add_to_cart_fired = false; } catch(_e){}
    }, 1500);

    try {
      var fd = new FormData(form);
      var variantId = fd.get('id');
      if (!variantId) return;

      var quantity = asInt(fd.get('quantity'), 1);
      if (quantity < 1) quantity = 1;

      var currency = {{ shop.currency | json }};
      var productId = {{ product.id }};
      var v = findVariant(variantId);

      var price = 0;
      var itemVariant = '';
      var sku = null;

      var affiliation   = "shopify_web_store";
      var item_list_id  = {{ product.handle | json }};
      var item_list_name = {{ product.title | json }};

      if (v) {
        price = num(v.price, 0) / 100;
        itemVariant = String(v.public_title || v.title || '');
        sku = v.sku || null;
      } else {
        price = {{ product.selected_or_first_available_variant.price | divided_by: 100.0 }};
        itemVariant = {{ product.selected_or_first_available_variant.title | json }};
        sku = {{ product.selected_or_first_available_variant.sku | json }};
      }

      var item = {
        item_id: "shopify_US_{{ product.id }}_" + String(variantId),
        item_group_id: "shopify_US_{{ product.id }}",

        product_id: productId,
        variant_id: asInt(variantId),
        sku: sku,

        item_name: {{ product.title | json }},
        item_variant: itemVariant,
        item_brand: {{ product.vendor | json }},
        item_category: {{ product.type | json }},

        price: price,
        currency: currency,
        quantity: quantity,

        affiliation: affiliation,

        item_list_id: item_list_id,
        item_list_name: item_list_name,
        index: 1,

        item_promotion_id: null,
        item_promotion_name: null,
        item_creative_name: null,
        item_creative_slot: null
      };

      window.terraPushEvent('add_to_cart', {
        ecommerce: {
          items: [item],
          item_list_id: item_list_id,
          item_list_name: item_list_name,
          currency: currency,
          value: quantity * price
        }
      });

    } catch (err) {
      /* silent by design */
    }
  });
})();
</script>
