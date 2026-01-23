{% if template.name == 'product' and product %}
<script id="terra_view_item_producer">
(function () {
  if (!window.terraBuildCanonicalItem || !window.terraPushEvent) return;

  var productId = {{ product.id }};
  var variantId = {{ product.selected_or_first_available_variant.id }};
  var sku = {{ product.selected_or_first_available_variant.sku | json }};

  var price = {{ product.selected_or_first_available_variant.price | divided_by: 100.0 }};
  var currency = {{ shop.currency | json }};

  var item = window.terraBuildCanonicalItem({
    product_id: productId,
    variant_id: variantId,
    sku: sku,

    item_name: {{ product.title | json }},
    item_variant: {{ product.selected_or_first_available_variant.title | json }},
    item_brand: {{ product.vendor | json }},
    item_category: {{ product.type | json }},

    item_list_id: {{ product.handle | json }},
    item_list_name: {{ product.title | json }},

    price: price,
    quantity: 1,
    currency: currency
  });

  if (!item) return;

  window.terraPushEvent('view_item', {
    ecommerce: {
      currency: currency,
      value: price,
      items: [item]
    }
  });
})();
</script>
{% endif %}
