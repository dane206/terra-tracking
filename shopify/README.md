# Terra Theme Scripts — Storefront Architecture (Authoritative)

These Shopify theme snippets implement the Terra storefront tracking pipeline that feeds:

**Shopify → Checkout Pixel → Cloud Run → GA4 MP → BigQuery → Terra analytics**

This is a **strict, layered system**. Each snippet has exactly one responsibility.

---

## Render Block (Authoritative Load Order)

This block in `theme.liquid` is the **only supported integration point**.

```liquid
{% render '00-terra-gtm-transport' %}

{% render '01-terra-attribution-bootstrap' %}   <!-- URL → cookies -->
{% render '02-terra-identity-ssot' %}           <!-- cookies → terra_ctx -->
{% render '03-terra-item-utils' %}              <!-- canonical item contract -->
{% render '04-terra-checkout-bridge' %}         <!-- terra_ctx → cart.attributes -->

{% if request.page_type == 'product' %}
  {% render '05-terra-view-item-producer' %}
  {% render '06-terra-add-to-cart-producer' %}
{% endif %}

{% if request.page_type == 'collection' %}
  {% render '07-terra-view-item-list-collection' %}
{% endif %}

{% if request.page_type == 'search' %}
  {% render '08-terra-view-item-list-search' %}
{% endif %}
```

### Load Order Rules

1. Attribution **must** run before identity
2. Identity **must** run before checkout bridge
3. Item utils **must** load before producers
4. Producers run last
5. GTM can load early because events are pushed after identity

---

## Layer Responsibilities

### `01-terra-attribution-bootstrap`

**Purpose:** Capture UTMs and click IDs from landing URL and persist to cookies.

Writes cookies only:

```
terra_ft_*
terra_lt_*
terra_gclid / gbraid / wbraid / msclkid / fbclid / ttclid
```

No ctx. No dataLayer. No cart calls.

---

### `02-terra-identity-ssot`

**Purpose:** Build `window.terra_ctx` from cookies and device/session state.

Reads cookies only:

* `th_vid`
* `terra_ga_*`
* `terra_ft_*`, `terra_lt_*`
* click IDs

Produces:

```
window.terra_ctx
```

No URL parsing. No cart calls.

---

### `03-terra-item-utils`

**Purpose:** Canonical item contract for every ecommerce event.

Exports:

```
terraBuildCanonicalItem()
terraValidateCanonicalItem()
```

Producers never build items manually.

---

### `04-terra-checkout-bridge`

**Purpose:** Bridge storefront identity into checkout.

Reads `terra_ctx` and writes to:

```
/cart/update.js → cart.attributes → checkout.attributes
```

This is the only way checkout sees identity, GA4 ids, UTMs, click IDs.

---

### Producers (05–08)

Each producer:

1. Gathers Shopify product data
2. Calls `terraBuildCanonicalItem`
3. Pushes event via `terraPushEvent`

They never construct item objects.

---

### `00-terra-gtm-transport`

Loads GTM and provides the dataLayer transport once identity is ready.

---

## Data Flow (Critical)

```
URL params
   ↓
01 attribution cookies
   ↓
02 terra_ctx
   ↓
04 cart.attributes
   ↓
checkout.attributes
   ↓
checkout pixel → Cloud Run → GA4 MP
```

This is why attribution and identity must run before the bridge.

---

## Canonical Guarantees

* Cookie name = ctx key = cart attribute key = checkout attribute key
* `items[]` schema is enforced by `terra-item-utils`
* Producers cannot cause schema drift
* Checkout always receives full identity + attribution
* GA4 MP stitching works because GA4 IDs cross the boundary

---

## What is intentionally NOT here

* No DOM data attributes
* No item construction in producers
* No attribution parsing inside identity
* No cart calls outside checkout bridge

Those were sources of previous drift and are now forbidden.

---

## Required DOM contract

* Each product card link must expose data attributes.
* `card-product.liquid` needs this added:

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

This structure is locked unless the **identity contract** or **item schema contract** intentionally changes.



