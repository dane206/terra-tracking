# Terra Theme Scripts — Test Notes

These tests verify **correct wiring**, **correct scope**, and **absence of silent failures**.

All tests are performed in the browser using DevTools.

---

## 1. Load-order sanity check

Open any page and run:

```js
window.terra_ctx
```

**Expected:**

* Object exists
* Contains `th_vid`, `session_key`, `session_start`, `ctx_version = "1.0.6"`

Then run:

```js
typeof window.terraBuildCanonicalItem
typeof window.terraValidateCanonicalItem
```

**Expected:**

* Both return `"function"`

If either fails, the render block order is wrong.

---

## 2. Identity events

In DevTools → **Console**:

```js
dataLayer.filter(e => e.event === 'terra_identity_ready')
```

**Expected:**

* Exactly **one** event per page load

If logged in, also check:

```js
dataLayer.filter(e => e.event === 'terra_user_authenticated')
```

**Expected:**

* Present only when logged in
* Contains `customer_id`
* Absent when logged out

---

## 3. Product page (`view_item`)

On a product page:

```js
dataLayer.filter(e => e.event === 'view_item')
```

Inspect the payload:

* `ecommerce.items.length === 1`
* `items[0].item_id` matches `shopify_US_<productId>_<variantId>`
* No totals inside `items[]`
* `ecommerce.value === item.price`

If the item fails validation, **no event should fire** and a console warning appears.

---

## 4. Add to cart (`add_to_cart`)

Add a product to cart.

```js
dataLayer.filter(e => e.event === 'add_to_cart')
```

Verify:

* Correct `quantity`
* `ecommerce.value === price × quantity`
* One canonical item in `items[]`

No duplicates should appear per submit.

---

## 5. Collection page (`view_item_list`)

On a collection page:

```js
dataLayer.filter(e => e.event === 'view_item_list')
```

Verify:

* `items.length > 0`
* `index` increments sequentially starting at 1
* All items pass canonical validation

---

## 6. Search results (`view_item_list`)

On a search results page:

```js
dataLayer.filter(e => e.event === 'view_item_list')
```

Verify:

* `item_list_id === "search_results"`
* Only product results are included
* No non-product objects appear

---

## 7. Negative tests (important)

* Navigate to a **non-product page** → no `view_item`
* Navigate to **empty search results** → no `view_item_list`
* Break an item intentionally (e.g. missing price in Liquid) →
  **event does not emit**, console warning appears

---

## Pass criteria (non-negotiable)

* Zero console errors
* No duplicate identity events
* No ecommerce events with empty or invalid `items[]`
* GTM loads after all producers

If all pass, the theme layer is considered **correct and frozen**.

---
