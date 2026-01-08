## Required DOM contract (already mostly true in Dawn)
- Each product card link must expose data attributes.
- `card-product` needs this added:

```
<a
  href="{{ product.url }}"
  data-terra-item
  data-item-id="shopify_US_{{ product.id }}_{{ product.selected_or_first_available_variant.id }}"
  data-item-group-id="shopify_US_{{ product.id }}"
  data-item-name="{{ product.title | escape }}"
  data-item-variant="{{ product.selected_or_first_available_variant.title | escape }}"
  data-item-brand="{{ product.vendor | escape }}"
  data-item-category="{{ product.type | handleize }}"
  data-item-price="{{ product.selected_or_first_available_variant.price | money_without_currency }}"
  data-item-index="{{ forloop.index0 }}"
>
```
