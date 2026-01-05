{% if template.name == 'product' and product %}
<script id="terra_view_item_producer">
(function () {
  if (!window.terraGetCTX || !window.terraPushEvent) return;

  var ctx = window.terraGetCTX();

  var price = {{ product.selected_or_first_available_variant.price | divided_by: 100.0 }};
  var currency = {{ shop.currency | json }};
  var quantity = 1;
  
  var affiliation = "shopify_web_store";
  var item_list_id = {{ product.handle | json }};
  var item_list_name = {{ product.title | json }};

  var productId = {{ product.id }};
  var variantId = {{ product.selected_or_first_available_variant.id }};
  var sku = {{ product.selected_or_first_available_variant.sku | json }};

  var item = {
    /* GA4 identity */
    item_id: "shopify_US_{{ product.id }}_{{ product.selected_or_first_available_variant.id }}",
    item_group_id: "shopify_US_{{ product.id }}",

    /* Terra join keys */
    product_id: productId,
    variant_id: variantId,
    sku: sku,

    /* Descriptive */
    item_name: {{ product.title | json }},
    item_variant: {{ product.selected_or_first_available_variant.title | json }},
    item_brand: {{ product.vendor | json }},
    item_category: {{ product.type | json }},

    /* Commercial */
    price: price,
    currency: currency,
    quantity: quantity,

    /* Global commerce context */
    affiliation: affiliation,

    /* PDP list context (your stated preference) */
    item_list_id: item_list_id,
    item_list_name: item_list_name,
    index: 1,

    /* Promo / creative (nullable, present) */
    item_promotion_id: null,
    item_promotion_name: null,
    item_creative_name: null,
    item_creative_slot: null
  };

  window.terraPushEvent('view_item', {
  ecommerce: {
    items: [item],
    item_list_id: item_list_id,
    item_list_name: item_list_name,
    currency: currency,
    value: quantity * price
  }
});
})();
</script>
{% endif %}
