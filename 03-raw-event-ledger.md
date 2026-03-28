⚠️ SUPERSEDED BY /00-spec/LAYER-01-ATTRIBUTION.md
Do not edit. Kept for historical reference.

# Raw Event Ledger (Contract)

## Purpose

Store **raw events exactly as received** from Shopify surfaces and manual probes, without transforming into GA4 or advertising semantics.

This ledger is the **authoritative write-ahead log** for all behavioral data.

## Owner surfaces

* Shopify Theme
* Shopify Custom Pixel
* Shopify App Pixel (if enabled)
* Manual probes / tests

## Status

**Canonical. Locked.**

---

## Law

* Raw ledger rows are **append-only**.
* **No renaming, suppression, filtering, or cleaning** at ingestion.
* **No GA4 / Ads semantics** at ingestion.
* All derivations happen **downstream only**.

---

## Canonical payload contract (what emitters send)

Every event POSTed to `/track` MUST include:

* `source` (string)
  One of:

  * `shopify_theme`
  * `shopify_pixel`
  * `shopify_app_pixel`
  * `manual_test`

* `event_id` (string)
  Required. Globally unique per event.

* `event` (string)
  Raw event name exactly as emitted
  Examples: `page_viewed`, `collection_viewed`, `clicked`, `raw_page_view`

* `timestamp` (string, ISO-8601)
  Time the event occurred at the emitting surface.

### Recommended (nullable)

* `th_vid` (string)
* `session_key` (string)
* `session_start` (string, ISO-8601)

### Raw containers (do not flatten)

* `payload` (object or null)
* `context` (object or null)
* `shop_domain` (string or null)

**All additional fields remain inside `payload` or `context`.**

---

## Legacy compatibility (collector-only)

To prevent breakage, the collector MAY accept older field names and map them internally:

* `body._source` → `source`
* `body.occurred_at` → `timestamp`
* `body.shopify_event` or `body.event_name` → `event`

Emitters MUST NOT rely on legacy keys going forward.

---

## BigQuery raw ledger contract

### Dataset / table

```
terra-analytics-dev.raw_dev.shopify_pixel_events
```

### Columns

* `received_at` TIMESTAMP **(required)**
  Server receipt time (authoritative ordering).

* `source` STRING
  Emitting surface (explicit).

* `shopify_event` STRING
  Optional mirror of `payload.event` for indexing only.

* `event_id` STRING
  Required. Used for deduplication downstream.

* `payload` JSON **(required)**
  Entire inbound request body as **native JSON**.

* `th_vid` STRING (nullable)

* `session_key` STRING (nullable)

* `session_start` TIMESTAMP (nullable)

### Rules

* `payload` accepts **arbitrary JSON shapes**
* **No schema enforcement** at this layer
* Unknown or noisy events are valid
* Table is not optimized for human readability

---

## Notes on JSON usage

* `payload` is stored as **BigQuery native JSON**
* Use `JSON_VALUE(payload, "$.event")` for scalar filtering
* Use `payload.field` for native JSON access
* Use `TO_JSON_STRING(payload)` for inspection / debugging

---

## Proof queries (BigQuery CLI)

### Events in last 2 minutes

```sql
SELECT COUNT(*) AS events_last_2_min
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE received_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 2 MINUTE);
```

### Count by source + event (last 10 minutes)

```sql
SELECT
  source,
  JSON_VALUE(payload, "$.event") AS event,
  COUNT(*) AS cnt
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE received_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)
GROUP BY source, event
ORDER BY cnt DESC;
```

### Verify `event_id` presence (last 10 minutes)

```sql
SELECT
  source,
  COUNT(*) AS events,
  COUNTIF(event_id IS NOT NULL AND event_id != '') AS with_event_id
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE received_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)
GROUP BY source
ORDER BY source;
```

---

## Final guarantees

* Raw ledger is **lossless**
* Ordering is **authoritative**
* Semantics are **deferred**
* Specs match **runtime reality**
* No silent drift allowed

---

**This spec is now canonical and complete.**
