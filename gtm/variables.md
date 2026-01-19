# GTM Variables (Storefront / GA4)

This document defines the **complete and final** set of GTM variables used for  
Shopify storefront → GA4 tracking.

All variables are **Data Layer Variables (Version 1)** unless stated otherwise.

Anything not listed here is **not used** and may be deleted safely.

---

## Identity & Context

| Variable Name   | Data Layer Key   |
|-----------------|------------------|
| event_id        | event_id         |
| ctx_id          | ctx_id           |
| ctx_version     | ctx_version      |
| timestamp       | timestamp        |
| iso_week        | iso_week         |
| device_type     | device_type      |
| th_vid          | th_vid           |
| session_key     | session_key      |
| session_start   | session_start    |
| shopify_env     | shopify_env      |

---

## Page Context

| Variable Name   | Data Layer Key   |
|-----------------|------------------|
| page_location   | page_location   |
| page_path       | page_path       |
| page_title      | page_title      |
| page_type       | page_type       |
| page_subdomain  | page_subdomain  |
| page_referrer   | page_referrer   |
| page_hostname   | page_hostname   |

---

## Ecommerce (GA4)

| Variable Name | Data Layer Key |
|---------------|----------------|
| ecommerce     | ecommerce      |
| items         | ecommerce.items |
| currency      | currency       |
| value         | value          |

Notes:
- `ecommerce.items` is **GA4 ecommerce schema**, not GTM Enhanced Ecommerce
- All ecommerce objects are **explicitly pushed by the theme**
- GTM does **not** build, merge, or infer ecommerce state

---

## List Context (Non-Ecommerce)

| Variable Name   | Data Layer Key |
|-----------------|----------------|
| item_list_id    | item_list_id  |
| item_list_name  | item_list_name |

Notes:
- List context is passed explicitly by the theme
- GTM does not derive list information from URLs, DOM, or page type

---

## Promotions

| Variable Name   | Data Layer Key |
|-----------------|----------------|
| promotion_id    | promotion_id  |
| promotion_name  | promotion_name |
| creative_name   | creative_name |
| creative_slot   | creative_slot |

Notes:
- Promotion identity is **low-cardinality**
- Creative fields carry campaign-level detail
- Promotion ecommerce objects are forwarded, not constructed

---

## UTMs (Raw, Unmodified)

| Variable Name | Data Layer Key |
|---------------|----------------|
| utm_source    | utm_source    |
| utm_medium    | utm_medium    |
| utm_campaign  | utm_campaign  |
| utm_content   | utm_content   |
| utm_term      | utm_term      |
| utm_id        | utm_id        |

Notes:
- UTMs are passed through **unchanged**
- No normalization or fallback logic exists in GTM

---

## Enforcement

- All variables are **Data Layer Variables (Version 1)**
- No Data Layer Variable (Version 2) variable type
- No GTM Enhanced Ecommerce (UA-style)
- No JavaScript variables
- No legacy ecommerce keys
- No inferred, defaulted, or synthesized values
- GTM is a **pure transport layer**

This variable list is **authoritative** for the storefront phase unless the dataLayer contract changes.
