# 1️⃣ `README.md` — **Storefront Tracking (SSOT v1.9)**

```md
# Storefront Tracking — SSOT v1.9

**Status:** COMPLETE · FROZEN  
**Scope:** Shopify Storefront Only (No Checkout)  
**Frozen Date:** 2026-01-21

---

## Overview

This repository implements a **minimal, immutable storefront tracking model** designed to:
- Separate traffic tracking from business events
- Produce a clean BigQuery event ledger
- Avoid Shopify checkout constraints
- Eliminate rework and renaming

Once frozen, **no storefront event may be changed**.

---

## First-Class Storefront Events (Immutable)

### Business / Ecommerce (Ingested)
These are the only storefront events written to Terra ingest and BigQuery:

- `view_item_list`
- `view_item`
- `add_to_cart`

Each event is:
- Emitted from the storefront
- Pushed to `dataLayer`
- Forwarded via GTM
- Ingested into BigQuery
- Deduplicated by `event_id`

Verified end-to-end.

---

### Platform / Context
- `terra_identity_ready`

Internal identity bootstrap required before any business event.

---

### Explicit Exception
- `page_view`

Tracked by GA4 only.  
Not ingested by Terra.  
Used strictly for traffic/session analysis.

---

## Explicitly Excluded Events

The following are not first-class storefront events:

- `view_cart` (derived only)
- `view_search_results`
- `form_start`, `form_submit`
- `scroll`, `user_engagement`, `session_start`
- All checkout events

Derived events must be created in SQL, never via tracking.

---

## Immutability Rules

For any event listed above:
- No renaming
- No payload changes
- No trigger changes
- No reinterpretation
- No backfills

Only additive work is permitted in future versions.

---

## Current State

Storefront tracking is **complete and closed**.  
Checkout tracking is handled separately.

SSOT Version: **v1.9**
```

---

# **Storefront Events — Single Source of Truth (SSOT)**

**Version:** **v1.9**
**Status:** 🔒 **FROZEN / IMMUTABLE**
**Scope:** Shopify **storefront only** (no checkout)

---

## 1. Purpose

Define the **only first-class storefront events** that are allowed to exist, be tracked, ingested, and queried.

Once listed here, events:
* are **not renamed**
* are **not redefined**
* are **not retroactively changed**
* are **never removed**

Only **additive events** may appear in a future version.

---

## 2. Event Ownership Model

| Layer        | Owns                        |
| ------------ | --------------------------- |
| GA4          | Traffic & engagement        |
| Terra ingest | Business / commerce actions |
| BigQuery     | Immutable raw ledger        |
| SQL          | Derived analytics only      |

---

## 3. First-Class Storefront Events (FINAL)

### 3.1 Business / Ecommerce (ingested)

These are the **only** storefront ecommerce events written to Terra ingest and BigQuery.
```
view_item_list
view_item
add_to_cart
```

**Verified guarantees:**
* Storefront-only emission
* Canonical GA4 naming
* Canonical `ecommerce.items[]` schema
* Stable ordering after identity
* UUID `event_id`
* Deduplicated
* Ingest ✅ PASS
* BigQuery ✅ PASS

---

### 3.2 Platform / Context (internal)

```
terra_identity_ready
```
* Identity bootstrap
* Required precursor
* Not a business event
* Not used for KPIs

---

### 3.3 Page View (explicit exception)

```
page_view
```
* **GA4-only**
* **Not ingested**
* Used only for traffic/session modeling
* Explicitly excluded to keep the ledger clean

This exclusion is intentional and final.

---

## 4. Explicit Non-Events (by design)

The following are **not first-class** and must **never** be ingested:
* `view_cart` → **derived only**
* `view_search_results`
* `form_start`, `form_submit`
* `scroll`, `user_engagement`, `session_start`
* Any checkout event

If needed, these are produced **via SQL**, not tracking.

---

## 5. Immutability Rules (Hard)

For any event listed in Section 3:
* ❌ No renaming
* ❌ No payload changes
* ❌ No trigger changes
* ❌ No reinterpretation
* ❌ No backfills

Only **new events** may be added under a new SSOT version.

---

## 6. Verification Status (as of 2026-01-21)

| Event                				| 	Ingest 		| 	BigQuery 	| Next step	|
| ---------------------------------	| ------------- | ------------- | ---------	|
| view_item_list       				| 	✅ PASS 	| 	✅ PASS 	|	✅ DONE	|
| view_item            				| 	✅ PASS 	| 	✅ PASS 	|	✅ DONE	|
| add_to_cart          				| 	✅ PASS 	| 	✅ PASS 	|	✅ DONE	|
| terra_identity_ready (internal) 	| 	✅ PASS 	| 	n/a     	|	✅ DONE	|
| page_view (GA4-only)  			| 	✅ PASS 	| 	n/a    		|	✅ DONE	|

---

## 7. Forward Policy

* Storefront is **closed**
* Derived events live in SQL
* Checkout has its **own SSOT**
* No cross-context leakage
* No changes without **SSOT v2.x**

---

### **Sign-off**

**SSOT v1.9** is the **authoritative truth** for storefront tracking.
Anything not listed here **does not exist**.

✅ Commit message — SSOT v1.9
chore(ssot): freeze storefront first-class events (v1.9)
- Finalize and freeze storefront SSOT v1.9
- Lock first-class events:
  - view_item_list
  - view_item
  - add_to_cart
- page_view remains GA4-only (not ingested)
- terra_identity_ready retained as internal bootstrap
- Storefront events verified end-to-end (dataLayer → GTM → ingest → BigQuery)
- No further storefront changes permitted without SSOT v2