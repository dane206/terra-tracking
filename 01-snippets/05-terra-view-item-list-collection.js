{% if template.name == 'collection' and collection %}
<script id="terra_view_item_list_collection">
(function () {
  if (window.__terra_view_item_list_collection_ran) return;
  window.__terra_view_item_list_collection_ran = true;

  if (!window.terraGetCTX || !window.terraPushEvent) return;

  var ctx = window.terraGetCTX();
  if (ctx.page_type !== 'collection') return;

  var affiliation = "shopify_web_store";
  var item_list_id = {{ collection.handle | json }};
  var item_list_name = {{ collection.title | json }};
  var currency = {{ shop.currency | json }};
  var items = [];

  {% assign max_items = 20 %}
  {% assign idx = 1 %}

  {% for product in collection.products %}
    {% if idx > max_items %}{% break %}{% endif %}
    {% assign variant = product.selected_or_first_available_variant %}
    {% if variant and variant.id %}
      items.push({
        /* GA4 identity */
        item_id: "shopify_US_{{ product.id }}_{{ variant.id }}",
        item_group_id: "shopify_US_{{ product.id }}",

        /* Terra join keys */
        product_id: {{ product.id }},
        variant_id: {{ variant.id }},
        sku: {{ variant.sku | json }},

        /* Descriptive */
        item_name: {{ product.title | json }},
        item_variant: {{ variant.title | json }},
        item_brand: {{ product.vendor | json }},
        item_category: {{ product.type | json }},

        /* Commercial */
        price: {{ variant.price | divided_by: 100.0 }},
        currency: currency,
        quantity: 1,

        /* Global commerce context */
        affiliation: affiliation,

        /* List context (THIS is what GA4 reads) */
        item_list_id: item_list_id,
        item_list_name: item_list_name,
        index: {{ idx }},

        /* Promo / creative (nullable) */
        item_promotion_id: null,
        item_promotion_name: null,
        item_creative_name: null,
        item_creative_slot: null
      });
      {% assign idx = idx | plus: 1 %}
    {% endif %}
  {% endfor %}

  if (!items.length) return;

  window.terraPushEvent('view_item_list', {
  ecommerce: {
    items: items,
    item_list_id: item_list_id,
    item_list_name: item_list_name,
    currency: currency
  }
});
})();
</script>
{% endif %}
