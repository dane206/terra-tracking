# GA4 Tags (Storefront)

- All tags are **Google Tag → Google Analytics: GA4 Event** tags.  
- All events depend on a single base Google Tag.

## Scope

- Shopify storefront only
- Theme → dataLayer → GTM → GA4
- No checkout
- No web pixel
- No server-side

---

## Base Tag

### `ga4_config`
- **purpose:** used to initialize GA4 only; establish routing; prevent deferred hits
- **type:** Google Tag
- **event name:** `ga4_config`
- **measurement id:** `{{ga4_measurement_id}}`
- **trigger:** `initialization - all pages`
- **tag firing:** `once per page`

**parameters:**
- **send_page_view:** `false`
- **allow_ad_personalization_signals:** `true`
- **allow_google_signals:** `true`

---

## Event Tags

### `page_view`
- **purpose:** the page_view event logs an instance where a customer visited a page
- **type:** Google Analytics: GA4 Event
- **event name:** `page_view`
- **measurement id:** `{{ga4_measurement_id}}`
- **trigger:** `ev_page_view`
- **tag firing:** default; once per event

**event settings variable `esv_terra_base_event`**

**parameters:**
- `event_id`
- `timestamp`
- `ctx_id`
- `ctx_version`
- `device_type`
- `iso_week`
- `th_vid`
- `session_key`
- `session_start`
- `page_hostname`
- `page_location`
- `page_path`
- `page_title`
- `page_type`
- `page_referrer`

**user_properties:**
- `th_vid`
- `device_type`

---

### `view_item_list`
- **purpose:** this event logs an instance where a customer visited a collection/search results
- **type:** Google Analytics: GA4 Event
- **event name:** `view_item_list`
- **measurement id:** `{{ga4_measurement_id}}`
- **trigger:** `ev_view_item_list`
- **tag firing:** default; once per event

**parameters:**
- `items`
- `item_list_id`
- `item_list_name`
- `currency`
- `value`

**item schema:**
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
- **purpose:** this event logs an instance where a customer visited a product details page
- **type:** Google Analytics: GA4 Event
- **event name:** `view_item`
- **measurement id:** `{{ga4_measurement_id}}`
- **trigger:** `ev_view_item`
- **tag firing:** default; once per event

**parameters:**
- `items`
- `currency`
- `value`

**item schema:**
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
- **purpose:** this event logs an instance where a customer adds a product to their cart
- **type:** Google Analytics: GA4 Event
- **event name:** `add_to_cart`
- **measurement id:** `{{ga4_measurement_id}}`
- **trigger:** `ev_add_to_cart`
- **tag firing:** default; once per event

**parameters:**
- `items`
- `currency`
- `value`

**item schema:**
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
- **purpose:** this event signifies a promotion was viewed from a list
- **type:** Google Analytics: GA4 Event
- **event name:** `view_promotion`
- **measurement id:** `{{ga4_measurement_id}}`
- **trigger:** `ev_view_promotion`
- **tag firing:** default; once per event

**parameters:**
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

**promotion item schema:**
- `promotion_id`
- `promotion_name`
- `creative_name`
- `creative_slot`
- `affiliation`

**notes:**
- `promotion_id` is low-cardinality (e.g. `email`)
- `promotion_name` reflects channel subtype (e.g. `email_flow`, `email_campaign`)
- `creative_*` fields carry campaign-level detail
- Promotions represent impressions, not product interactions

---

## Enforcement
- GTM does **not** create, infer, or reshape `ecommerce` or `promotion` objects
- GTM does **not** infer currency or value
- GTM does **not** emit checkout events
- GTM listens **only** to explicit `dataLayer` events
This tag list is **final** unless the dataLayer contract changes.
