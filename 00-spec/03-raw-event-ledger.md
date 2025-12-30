# 03_raw_shopify_events.md

# Raw Shopify Events (Ledger Contract)

**Purpose:** Define the permanent, immutable raw event ledger ingested from Shopify surfaces without semantic mutation.  
**Owner:** Shopify Web Pixel (Custom Pixel) + Shopify Theme (explicit theme-native raw emissions)  
**Status:** Canonical (LAW)  
**Effective Version:** 1.0.5  
**Last Updated:** 2025-12-29

---

## 1) Definition of “Raw Event”

A **raw event** is the closest possible representation of what was emitted at the source, captured at ingestion time **without semantic mutation**.

Raw events are not analytics events.  
Raw events are not GA4 events.  
Raw events are not “cleaned”.

They form a **ledger**.

---

## 2) Core Ledger Invariants (Non-Negotiable)

If any invariant is violated, the system is **incorrect**.

### 2.1 Immutability
- Raw events are stored permanently
- Raw events are never updated
- Raw events are never deleted
- Raw events are never renamed

### 2.2 Fidelity
- Events are captured exactly as emitted
- No semantic transformation occurs at ingestion
- No inferred meaning is added

### 2.3 Completeness
- Unknown event names are accepted
- New Shopify event types must not break ingestion
- Missing optional fields must not cause rejection

### 2.4 Separation of Concerns
- Raw ingestion never creates derived events
- GA4 / Ads semantics happen downstream only
- Dedupe logic must not suppress raw events

---

## 3) Global Required Invariant

### 3.1 `event_id` is REQUIRED
Every raw event **MUST** include a non-null `event_id`.

`event_id` is required for:
- dedupe
- traceability
- auditing
- downstream joins

**Source responsibility:**
- Shopify Theme → generates `event_id`
- Shopify Web Pixel → generates `event_id`
- Collector → must reject or quarantine events missing `event_id`

If `event_id` is null, the event violates this contract.

---

## 4) Field Naming Rules (LAW)

### 4.1 No leading underscores for canonical fields
Canonical field names **MUST NOT** use leading underscores.

**Canonical:** `source`  
**Canonical:** `event_name`  
**Canonical:** `event_id`

### 4.2 Legacy compatibility
If a source still sends `_source`, the collector may map it to `source`, but the ledger contract is `source`.

---

## 5) Sources Currently Ingested

### 5.1 Shopify Web Pixel (Custom Pixel)
Primary Shopify-emitted event stream.

**Canonical source value:** `shopify_pixel`

Minimum required outbound payload fields:

| Field | Requirement |
|---|---|
| `event_id` | REQUIRED (non-null) |
| `source` | REQUIRED (`shopify_pixel`) |
| `event_name` | REQUIRED (Shopify event name) |
| `timestamp` | REQUIRED (Shopify timestamp) |
| `payload` | REQUIRED (raw `event.data`) |
| `context` | OPTIONAL (recommended, raw context object) |
| `shop_domain` | OPTIONAL (nullable) |
| `th_vid` | REQUIRED if available (nullable allowed) |
| `session_key` | REQUIRED if available (nullable allowed) |
| `session_start` | REQUIRED if available (nullable allowed) |

**Identity rule:**
- Pixel must **not** generate identity
- Pixel only **reads** identity from `localStorage`
- Identity fields may be null but must be present as keys when possible

---

### 5.2 Shopify Theme (Bootstrap + Producers)
Theme is the identity + page-context source of truth.

**Canonical source value:** `shopify_theme`

Theme owns:
- `th_vid`
- `session_key`
- `session_start`
- `ctx_version`
- page fields (`page_type`, `page_location`, etc.)

Allowed theme raw events (examples):
- `terra_identity_ready`
- `terra_shopify_loaded`
- `raw_page_view`

Theme **must generate** `event_id` for every event it emits.

Theme **must not** emit Shopify semantic events that the pixel already emits (e.g. `checkout_started`).

---

### 5.3 Shopify App Pixel (Web Pixel Extension)
If enabled, treat it as another raw source.

**Canonical source value:** `shopify_app_pixel`

Rules:
- same raw ledger treatment
- duplication allowed in raw
- duplication resolved only downstream

---

## 6) Raw Event Names (Observed Examples)

This list is open-ended. Ledger must accept unknown values.

### 6.1 Shopify Pixel examples
- `page_viewed`
- `clicked`
- `input_focused`
- `input_blurred`
- `input_changed`
- `form_submitted`
- `search_submitted`
- `collection_viewed`
- `product_viewed`
- `cart_viewed`
- `product_added_to_cart`
- `product_removed_from_cart`
- `checkout_started`
- `checkout_contact_info_submitted`
- `checkout_address_info_submitted`
- `checkout_shipping_info_submitted`
- `payment_info_submitted`
- `checkout_completed`

### 6.2 Theme examples
- `terra_identity_ready`
- `terra_shopify_loaded`
- `raw_page_view`

---

## 7) BigQuery Raw Ledger Table Contract

### 7.1 Table
Dataset and table:

- Dataset: `terra_events_raw`
- Table: `events_raw`

DEV project: `terra-analytics-dev`

Fully-qualified:

`terra-analytics-dev.terra_events_raw.events_raw`

---

### 7.2 Required Columns

| Column | Type | Notes |
|---|---|---|
| `received_at` | TIMESTAMP | server receipt time |
| `source` | STRING | REQUIRED |
| `event_id` | STRING | REQUIRED |
| `event_name` | STRING | REQUIRED |
| `event_time` | TIMESTAMP | nullable (parsed from `timestamp`) |
| `payload_json` | STRING | REQUIRED (full inbound body) |

---

### 7.3 Payload storage rule
`payload_json` stores the full inbound request body as a JSON string, unmodified.

Rationale:
- prevents schema breakage
- preserves exact source shape
- enables late parsing in staging

Typed extraction happens **after raw**, never here.

---

## 8) Collector Enforcement Rules

### 8.1 Collector MUST
- accept unknown event names
- insert events without semantic mutation
- preserve full payload in `payload_json`
- add `received_at`

### 8.2 Collector MUST reject or quarantine
- invalid JSON
- oversized payloads
- missing `source`
- missing `event_name`
- missing `event_id`

### 8.3 Collector MUST NOT
- generate `event_id`
- infer identity
- rename events
- create derived events

---

## 9) Relationship to Derived Events
- raw events are inputs
- derived events are outputs
- one raw event may produce zero/one/many derived events
- raw events are never suppressed

---

## 10) Proof Mode
When `proof_mode = true`:
- raw events are always emitted
- derived events may emit in parallel
- namespacing applies only to derived events

Raw ledger behavior never changes.

---

## 11) Enforcement & Change Control

Any change to:
- required fields
- source ownership
- storage guarantees

Requires:
1. version bump
2. update to this document
3. review of `05_event_ownership_matrix.md`

---

## 12) Final Statement

This ledger is immutable by design.

If raw data is wrong, the system is wrong.

**Fix sources. Never rewrite the ledger.**
