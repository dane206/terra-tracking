Below is a **final-draft README section** followed by **final-draft test notes**.
You can paste these directly into your documentation. Nothing speculative, nothing new.

---

# Terra Theme Scripts — README

Canonical, source-of-truth **Shopify theme snippets** for Terra ecommerce tracking.

These snippets intentionally implement **identity → utilities → producers → transport** with strict scope separation and deterministic load order.

All snippets are stored as `.liquid` in Shopify and mirrored verbatim as `.js` files in backup documentation.

---

## Render Block (Authoritative)

The **render block** is the ordered list of `{% render %}` statements in `theme.liquid` that defines **what loads, where, and in what order**.

This is the *only* supported integration point.

```liquid
{% render '01-terra-identity-ssot' %}
{% render '02-terra-user-identity' %}
{% render '03-terra-item-utils' %}

{% if request.page_type == 'product' %}
  {% render '04-terra-view-item-producer' %}
  {% render '05-terra-add-to-cart-producer' %}
{% endif %}

{% if request.page_type == 'collection' %}
  {% render '06-terra-view-item-list-collection' %}
{% endif %}

{% if request.page_type == 'search' %}
  {% render '07-terra-view-item-list-search' %}
{% endif %}

{% render '00-terra-gtm-transport' %}
```

**Rules:**

* Identity **must** load before anything else
* Utilities **must** load before producers
* GTM **must** load last
* Producers are page-scoped only

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


---

## File Map

* **`00-terra-gtm-transport`**
  Loads Google Tag Manager after the dataLayer has been populated.

* **`01-terra-identity-ssot`**
  Canonical identity source of truth.
  Sets `th_vid`, `session_key`, `session_start`, page + device context.
  Exports shared helpers (`terraGetUUID`, `terraNowIso`).
  Versioned (`v1.0.6`).

* **`02-terra-user-identity`**
  Emits authenticated identity **only when a Shopify customer exists**.
  Provides `customer_id` without polluting anonymous sessions.

* **`03-terra-item-utils`**
  Canonical item builder + validator.
  Enforces the `items[]` contract used by all ecommerce events.

* **`04-terra-view-item-producer`**
  Emits validated `view_item` events on product pages.

* **`05-terra-add-to-cart-producer`**
  Emits validated `add_to_cart` events when items are added to cart.

* **`06-terra-view-item-list-collection`**
  Emits validated `view_item_list` events for collection pages.

* **`07-terra-view-item-list-search`**
  Emits validated `view_item_list` events for search results.

---

## Design Guarantees

* `items[]` contains **SKU-level facts only**
* `ecommerce` contains **currency, totals, and transaction context**
* Invalid items are **never emitted**
* Identity is **truthful, explicit, and versioned**
* GTM never loads before the dataLayer is ready
* No snippet mutates another snippet’s state

This structure is locked unless identity semantics or ecommerce contracts intentionally change.

---
