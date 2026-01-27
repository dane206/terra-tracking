<script id="06-terra_add_to_cart_producer">
(function () {
  if (window.__terra_add_to_cart_ran) return;
  window.__terra_add_to_cart_ran = true;

  if (!window.terraBuildCanonicalItem) return;

  var variants = {{ product.variants | json }};
  var currency = {{ shop.currency | json }};

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

    if (form.__terra_add_to_cart_fired) return;
    form.__terra_add_to_cart_fired = true;
    setTimeout(function(){
      try { form.__terra_add_to_cart_fired = false; } catch(_e){}
    }, 1500);

    try {
      var fd = new FormData(form);
      var variantId = fd.get('id');
      if (!variantId) return;

      var quantity = parseInt(fd.get('quantity') || '1', 10);
      if (!isFinite(quantity) || quantity < 1) quantity = 1;

      var v = findVariant(variantId);
      if (!v) return;

      var price = Number(v.price) / 100;

      var item = window.terraBuildCanonicalItem({
        product_id: {{ product.id }},
        variant_id: variantId,
        sku: v.sku,

        item_name: {{ product.title | json }},
        item_variant: String(v.public_title || v.title || ''),
        item_brand: {{ product.vendor | json }},
        item_category: {{ product.type | json }},

        item_list_id: {{ product.handle | json }},
        item_list_name: {{ product.title | json }},

        price: price,
        quantity: quantity,
        currency: currency
      });

      if (!item) return;

      window.terraPushEvent('add_to_cart', {
        ecommerce: {
          currency: currency,
          value: quantity * price,
          items: [item]
        }
      });

    } catch (_) {}
  });
})();
</script>
