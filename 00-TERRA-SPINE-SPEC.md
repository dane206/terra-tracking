# Terra System Spine — Authoritative Contract

Legend
- * = Required on every Terra event
- † = Key must exist, value may be empty
- § = Required on ecommerce events
- ¶ = Items[] field, only present when items[] exists

---

## Identity (visitor ↔ session)

* th_vid
* session_key
* session_start

---

## Event Integrity (every event)

* event
* event_id
* event_name
* timestamp
* iso_week
* ctx_id
* ctx_version
* device_type

---

## GA4 / Google Stitch (must equal GA4)

* terra_ga_cid  = ga4_client_id
* terra_ga_sid  = ga4_session_id
* terra_ga_sn   = ga4_session_number

---

## First-Touch Attribution (lifetime)

† terra_ft_source
† terra_ft_medium
† terra_ft_campaign
† terra_ft_content
† terra_ft_term
† terra_ft_id

---

## Last-Touch Attribution (session)

† terra_lt_source
† terra_lt_medium
† terra_lt_campaign
† terra_lt_content
† terra_lt_term
† terra_lt_id

---

## Ad / Click Identifiers (when present)

† terra_gclid
† terra_gbraid
† terra_wbraid
† terra_msclkid
† terra_fbclid
† terra_ttclid

---

## Page Context (every event)

* page_hostname
* page_location
* page_path
* page_title
* page_type
† page_referrer

---

## Commerce Context (ecommerce events)

§ affiliation
§ currency
§ value

---

## Ecommerce Item Contract (when items[] exists)

§ items[]

¶ item_id         = shopify_US_<productId>_<variantId>
¶ item_group_id   = shopify_US_<productId>
¶ variant_id
¶ sku

¶ item_name
¶ item_brand
¶ item_category
¶ item_category2
¶ item_category3
¶ item_category4
¶ item_category5
¶ item_variant

¶ price
¶ quantity
¶ discount
¶ coupon
¶ index

¶ item_list_id
¶ item_list_name

¶ location_id
¶ creative_name
¶ creative_slot
¶ promotion_id
¶ promotion_name

---

## Critical Rules

### Spine fields
Keys must always exist. Blank allowed.

### Items[]
Never send blank fields. Only include keys with real values.

### Promotions
promotion_* fields only allowed when a `select_promotion` occurred in-session.
Never inferred from PDP, Liquid, URL, or defaults.
