{% if template.name == 'search' %}
<script id="terra_view_item_list_search">
(function () {
  if (window.__terra_view_item_list_search_ran) return;
  window.__terra_view_item_list_search_ran = true;

  if (!window.terraBuildCanonicalItem || !window.terraPushEvent) return;

  var item_list_id = "search_results";
  var item_list_name = "search_results";
  var currency = {{ shop.currency | json }};
  var items = [];

  {% assign max_items = 20 %}
  {% assign idx = 1 %}

  {% for item in search.results %}
    {% if idx > max_items %}{% break %}{% endif %}
    {% if item.object_type == 'product' %}
      {% assign product = item %}
      {% assign variant = product.selected_or_first_available_variant %}
      {% if variant and variant.id %}
        (function () {
          var built = window.terraBuildCanonicalItem({
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

          if (built) items.push(built);
        })();
        {% assign idx = idx | plus: 1 %}
      {% endif %}
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
