{% if template.name == 'collection' and collection %}
<script id="07-terra_view_item_list_collection">
(function () {
  if (window.__terra_view_item_list_collection_ran) return;
  window.__terra_view_item_list_collection_ran = true;

  if (!window.terraBuildCanonicalItem) return;

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
      (function () {
        var item = window.terraBuildCanonicalItem({
          product_id: {{ product.id }},
          variant_id: {{ variant.id }},
          sku: {{ variant.sku | json }},

          item_name: {{ product.title | json }},
          item_variant: {{ variant.title | json }},
          item_brand: {{ product.vendor | json }},
          item_category: {{ product.type | json }},

          item_list_id: item_list_id,
          item_list_name: item_list_name,
          index: {{ idx }},

          price: {{ variant.price | divided_by: 100.0 }},
          quantity: 1,
          currency: currency
        });

        if (item) items.push(item);
      })();
      {% assign idx = idx | plus: 1 %}
    {% endif %}
  {% endfor %}

  if (!items.length) return;

  window.terraPushEvent('view_item_list', {
    ecommerce: {
      currency: currency,
      item_list_id: item_list_id,
      item_list_name: item_list_name,
      items: items
    }
  });
})();
</script>
{% endif %}
