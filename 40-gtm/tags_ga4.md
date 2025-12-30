# GA4 Tags (Storefront)

All tags are **Google Tag → Event** tags.  
All events depend on a single base Google Tag.

## Scope
- Shopify storefront only
- Theme → dataLayer → GTM → GA4
- No checkout
- No Web Pixel
- No server-side

---

## Base Tag

### `google_tag`

- **Type:** Google Tag
- **Measurement ID:** `{{ga4_measurement_id}}`
- **Trigger:** `init_all_pages`
- **send_page_view:** `false`

**Purpose:** Initialize GA4 only.

---

## Event Tags

### `terra_identity`

- **Event name:** `terra_identity`
- **Trigger:** `ev_terra_identity`

**Parameters:**
- `event_id`
- `ctx_id`
- `ctx_version`
- `timestamp`
- `iso_week`
- `device_type`
- `th_vid`
- `session_key`
- `session_start`
- `page_type`
- `shopify_env`

---

### `page_view`

- **Event name:** `page_view`
- **Trigger:** `ev_page_view`

**Parameters:**
- `event_id`
- `ctx_id`
- `ctx_version`
- `page_location`
- `page_path`
- `page_title`
- `page_referrer`
- `page_hostname`
- `page_subdomain`
- `page_type`
- `device_type`
- `iso_week`
- `th_vid`
- `session_key`

---

### `view_item_list`

- **Event name:** `view_item_list`
- **Trigger:** `ev_view_item_list`

**Parameters:**
- `event_id`
- `currency`
- `ecommerce.items[]`

**Item schema:**
- `item_id`
- `item_group_id`
- `product_id`
- `variant_id`
- `sku`
- `item_name`
- `item_variant`
- `item_brand`
- `item_category`
- `price`
- `quantity`
- `index`
- `item_list_id`
- `item_list_name`

---

### `view_item`

- **Event name:** `view_item`
- **Trigger:** `ev_view_item`

**Parameters:**
- `event_id`
- `currency`
- `ecommerce.items[]`

**Item schema:**
- `item_id`
- `item_group_id`
- `product_id`
- `variant_id`
- `sku`
- `item_name`
- `item_variant`
- `item_brand`
- `item_category`
- `price`
- `quantity`

---

### `add_to_cart`

- **Event name:** `add_to_cart`
- **Trigger:** `ev_add_to_cart`

**Parameters:**
- `event_id`
- `currency`
- `value`
- `ecommerce.items[]`

**Item schema:**
- `item_id`
- `item_group_id`
- `product_id`
- `variant_id`
- `sku`
- `item_name`
- `item_variant`
- `item_brand`
- `item_category`
- `price`
- `quantity`

---

### `view_promotion`

- **Event name:** `view_promotion`
- **Trigger:** `ev_view_promotion`

**Parameters:**
- `event_id`
- `promotion_id`
- `promotion_name`
- `creative_name`
- `creative_slot`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `utm_id`
- `ecommerce.items[]`

**Promotion item schema:**
- `promotion_id`
- `promotion_name`
- `creative_name`
- `creative_slot`
- `affiliation`

**Notes:**
- `promotion_id` is low-cardinality (e.g. `email`)
- `promotion_name` reflects channel subtype (e.g. `email_flow`, `email_campaign`)
- `creative_*` fields carry campaign-level detail
- Promotions represent impressions, not product interactions

---

## Enforcement

- GTM does **not** create, infer, or reshape ecommerce or promotion objects
- GTM does **not** infer currency or value
- GTM does **not** emit checkout events
- GTM listens **only** to explicit `dataLayer` events

This tag list is **final** unless the dataLayer contract changes.
