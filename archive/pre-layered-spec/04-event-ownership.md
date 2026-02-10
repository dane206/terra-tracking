⚠️ SUPERSEDED BY /00-spec/LAYER-01-ATTRIBUTION.md
Do not edit. Kept for historical reference.

# Event Ownership Matrix (FINAL)

**Purpose**  
Define exactly **one authoritative emitter** for every event.  
Prevent duplicate firing, semantic drift, and retroactive ambiguity.

This document is the **final arbiter** of event ownership.

---

## Applies to ctx_version 1.0.3
As of ctx_version 1.0.3, bootstrap is also responsible for injecting
context and identity into all events emitted via `terraPushEvent()`.

---

## Core Rules (Non-Negotiable)

- Every event has **one and only one owner**
- Ownership is based on **execution surface**, not convenience
- No event may be emitted from more than one surface
- Raw events and derived events are **different classes**
- Derived events **never replace** raw events
- GTM **never emits** ecommerce events

---

## Event Classes

1. **Context Events**  
   Identity, session, page boundary only  
   No ecommerce semantics

2. **Raw Shopify Events**  
   Exact Shopify platform signals  
   Ledger only

3. **Storefront Interaction Events**  
   Pre-checkout user intent  
   Theme-only

4. **Derived Analytics Events**  
   GA4-compatible  
   Built intentionally from known sources

---

## Context & Bootstrap (Theme)

| Event | Owner | Notes |
|---|---|---|
| `terra_identity_ready` | Theme Bootstrap | Once per page load 	|
| `terra_shopify_loaded` | Theme Bootstrap | Once per page load 	|
| `page_view` 			 | Theme Bootstrap | GA4 analytics boundary |

- `terra_shopify_loaded` is retained temporarily and may be removed in a future 
revision without affecting downstream contracts.

**Explicitly NOT emitted**
- `terra_page_context`

_All required context is attached to the two events above._

---

### Quick Event Review: 12-23-2025

`terra_identity_ready`
-	PASS (storefront push is valid for 1.0.3). Checked fields:
		event: terra_identity_ready ✅
		ctx_version: 1.0.3 ✅
		ctx_id: present ✅
		ctx_timestamp: present (ISO) ✅
		ctx_shopify_env: dev ✅
		iso_week: 2025_W52 ✅
		device_type: desktop ✅
		th_vid: present ✅
		session_key: present ✅
		session_start: present (ISO) ✅
		page_hostname: present ✅
		page_location: present ✅
		page_path: / ✅
		page_title: present ✅
		page_type: home ✅
		page_subdomain: present ✅
		page_referrer: empty string is acceptable ✅
		event_id: present ✅
		timestamp: present (ISO) ✅
		gtm.uniqueEventId: present ✅
-	No required ordering constraint. This object is clean and compliant.
-	specifically seen in GA4:
	-	`event_id`: present ✅
	-	`iso_week`: 2025_W52 ✅
	-	`device_type`: desktop ✅
	- 	`page_type`: home ✅
	-	`page_subdomain`: present ✅
	-	`session_key`: present ✅
	-	`th_vid`: present ✅

`terra_shopify_loaded`
-	PASS (valid for 1.0.3).
		event: terra_shopify_loaded ✅
		ctx_version: 1.0.3 ✅
		ctx_id: present ✅
		ctx_timestamp: present ✅
		ctx_shopify_env: dev ✅
		iso_week: 2025_W52 ✅
		device_type: desktop ✅
		th_vid: present ✅
		session_key: present ✅
		session_start: present ✅
		page_hostname: present ✅
		page_location: present ✅
		page_path: / ✅
		page_title: present ✅
		page_type: home ✅
		page_subdomain: present ✅
		page_referrer: empty string is acceptable ✅
		event_id: present ✅
		timestamp: present ✅
		gtm.uniqueEventId: present ✅
-	No changes needed.

`page_view`
-	PASS (valid for 1.0.3).
		event: page_view ✅
		ctx_version: 1.0.3 ✅
		ctx_id: present and consistent with prior events ✅
		ctx_timestamp: present and consistent ✅
		ctx_shopify_env: dev ✅
		iso_week: 2025_W52 ✅
		device_type: desktop ✅
		th_vid: present and consistent ✅
		session_key: present and consistent ✅
		session_start: present and consistent ✅
		page_hostname: present ✅
		page_location: present ✅
		page_path: / ✅
		page_title: present ✅
		page_type: home ✅
		page_subdomain: present ✅
		page_referrer: empty string is acceptable ✅
		event_id: present and unique ✅
		timestamp: present and aligned with ctx_timestamp ✅
		gtm.uniqueEventId: present and ordered ✅
-	No changes needed.

`gtm.js`
-	PASS (valid for 1.0.3).
-	No changes needed.

`gtm.dom`
-	PASS (valid for 1.0.3).
-	No changes needed.

`gtm.load`
-	PASS (valid for 1.0.3).
-	No changes needed.

`gtm.scrollDepth`
-	PASS (valid for 1.0.3).
-	auto-event fired: scroll
-	`percent_scrolled` present: yes.
-	No changes needed.

`view_search_results`
-	PASS (valid for 1.0.3).
-	auto-event fired: view_search_results
-	`search_term` present: yes.
-	No changes needed.

`session_start`
-	PASS (valid for 1.0.3).
-	auto-event fired: session_start
-	`event_id`
-	`iso_week`
-	`device_type`
- 	`page_type`
-	`page_subdomain`
-	`session_key`
-	`th_vid`
-	No changes needed.

`page_view`
-	PASS (valid for 1.0.3).
-	auto-event fired: page_view
-	`event_id`
-	`iso_week`
-	`device_type`
- 	`page_type`
-	`page_subdomain`
-	`session_key`
-	`th_vid`
-	No changes needed.

`form_start`
-	PASS (valid for 1.0.3).
-	auto-event fired: form_start
-	No changes needed.

`form_submit`
-	PASS (valid for 1.0.3).
-	auto-event fired: form_submit
-	No changes needed.

`user_engagement`
-	PASS (valid for 1.0.3).
-	auto-event fired: user_engagement
-	No changes needed.

---

## Raw Shopify Ledger (Web Pixel)

| Shopify Event | Owner | Notes |
|---|---|---|
| `page_viewed` | Web Pixel | Raw only |
| `collection_viewed` | Web Pixel | Raw only |
| `search_submitted` | Web Pixel | Raw only |
| `product_viewed` | Web Pixel | Raw only |
| `product_added_to_cart` | Web Pixel | Raw only |
| `product_removed_from_cart` | Web Pixel | Raw only |
| `cart_viewed` | Web Pixel | Raw only |
| `checkout_started` | Web Pixel | Raw only |
| `checkout_shipping_info_submitted` | Web Pixel | Raw only |
| `payment_info_submitted` | Web Pixel | Raw only |
| `checkout_completed` | Web Pixel | Raw only |

**Explicitly excluded**
- `checkout_contact_info_submitted`
- `alert_displayed`
- `ui_extension_errored`

---

## Storefront Interaction (Pre-Checkout, Theme)

| Event 			| Owner | Notes 				|
| ----------------- | ----- | --------------------- |
| `view_promotion` 	| Theme | Visual exposure only 	|
| `view_item_list` 	| Theme | Primary list context 	|
| `view_item` 		| Theme | Product page only 	|
| `add_to_cart` 	| Theme | Explicit intent 		|

**Explicitly NOT storefront**
- `page_view` (bootstrap only)
- `view_cart`
- `remove_from_cart`
- `select_item`
- Any checkout events

---

### Quick Event Review: 12-23-2025

`view_item_list` (collections) ✅
-	PASS (valid for 1.0.3).
-	required Terra context fields present (ctx_*, event_id, timestamp, th_vid, session_*, page_*): yes. 
-	ecommerce.items[] populated with canonical item_id = shopify_US_<productId>_<variantId> and item_group_id: yes. 
-	list identifiers present (item_list_id, item_list_name at item + ecommerce level): yes (all / Products). 
-	value omitted for view_item_list: acceptable (not required). 
-	sku is null for some items: acceptable (as long as it is passed it when available).
-	No changes needed.

`view_item_list` (search_results) ✅
-	PASS (valid for 1.0.3).
-	required Terra context fields present (ctx_*, event_id, timestamp, th_vid, session_*, page_*): yes. 
-	ecommerce.items[] populated with canonical item_id = shopify_US_<productId>_<variantId> and item_group_id: yes. 
-	list identifiers present (item_list_id, item_list_name at item + ecommerce level): yes (search_results / search_results). 
-	value omitted for view_item_list: acceptable (not required). 
-	sku is null for some items: acceptable (as long as it is passed it when available).
-	No changes needed.

`view_item` (products)
-	PASS (valid for 1.0.3).
-	required Terra context fields present.
-	ecommerce payload follows canonical design.
-	list identifiers present (acceptable on PDP; consistent with your earlier decision): yes. 
-	value present for view_item: yes (required). 
-	No changes needed.

`add_to_cart` (products)
-	PASS (valid for 1.0.3).
-	required Terra context fields present.
-	ecommerce payload follows canonical design.
-	list identifiers present (consistent with your earlier decision): yes. 
-	value present for add_to_cart: yes (required). 
-	No changes needed.

---

## Checkout & Purchase (Derived, Web Pixel)

| Event | Owner | Source |
|---|---|---|
| `view_cart` | Web Pixel | `cart_viewed` |
| `remove_from_cart` | Web Pixel | `product_removed_from_cart` |
| `begin_checkout` | Web Pixel | `checkout_started` |
| `add_shipping_info` | Web Pixel | `checkout_shipping_info_submitted` |
| `add_payment_info` | Web Pixel | `payment_info_submitted` |
| `purchase` | Web Pixel | `checkout_completed` |

Each derived event:
- Has its **own `event_id`**
- Coexists with the raw ledger event
- Is emitted **exactly once per lifecycle step**

---

## GA4 Derived Event Contracts (Summary)

### Baseline bootstrap events (`terra_identity_ready`, `terra_shopify_loaded`) are 
emitted by the theme for debugging and lifecycle clarity and do not carry ecommerce semantics.

### `page_view`
- Owner: Theme Bootstrap
- Fired once per page load
- Full Terra context required
- **Never emitted by Web Pixel or GTM**

---

### `view_item`
- Owner: Theme
- Fired once per product page load
- Exactly one item in `ecommerce.items[]`
- Canonical item IDs, numeric price, currency, `event_id`
- **Never emitted by Web Pixel or GTM**

---

### `view_item_list`
- Owner: Theme
- Fired once per page load
- Allowed contexts:
  - `collection`
  - `search_results`
  - `home` (featured / primary merchandising lists only)
- Requires `item_list_id`, `item_list_name`
- Full GA4 `ecommerce.items[]` with preserved `index`
- **Never emitted by Web Pixel or GTM**

---

### `add_to_cart`
- Owner: Theme
- Fired only on explicit submit
- Correct quantity required
- Full GA4 `ecommerce.items[]`
- **Never emitted by Web Pixel or GTM**

---

### `view_cart`
- Owner: Web Pixel
- Mirrors Shopify cart state
- Full GA4 `ecommerce.items[]`
- **Never emitted by Theme or GTM**

---

### `remove_from_cart`
- Owner: Web Pixel
- Fired only when quantity decreases
- Removed item only
- **Never emitted by Theme or GTM**

---

### Checkout & Purchase Events
(`begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`)

- Owner: Web Pixel
- Governed by Shopify checkout lifecycle
- Follow `00-spec/06_begin_checkout_policy.md`
- **Never emitted by Theme or GTM**

---

## GTM Role (Strict)

GTM **only**:
- Routes events
- Maps parameters

GTM **never**:
- Emits ecommerce events
- Creates identity or context
- Duplicates events

---

## Server Collector Role

Server-side ingestion may:
- Deduplicate by `event_id`
- Persist raw + derived events

Server-side ingestion may **not**:
- Create events
- Change ownership
- Backfill context

---

## Enforcement

Any change requires:
1. Update to this document
2. Review of:
   - `02_identity_and_sessions.md`
   - `03_raw_shopify_events.md`
   - `06_begin_checkout_policy.md`

**This matrix is authoritative and final.**
