# terra-tracking
SSOT canonical event tracking system for Terra Health
# Terra Tracking

This repository is governed exclusively by `/00-spec`.

Only files marked as **LAW** define system truth.
All code, GTM, collectors, and analytics must conform to those contracts.

Anything outside `/00-spec` is implementation or tooling.

Below is a **strict, step-by-step flow chart** for **DEV only**.
No skips. Each step depends on the previous one passing.

---

## DEV FLOW (END-TO-END)

### 0 → Preconditions

* Store: `terra-dev-plus-store.myshopify.com`
* Collector: `pixel-ingest-dev-…/track`
* BigQuery: `terra-analytics-dev.raw_dev.shopify_pixel_events`
* `TERRA_SECRET` set in Cloud Run

**If any are false → stop.**

---

### 1 → Theme SSOT initializes

**Action (browser console):**

```js
window.terra_ctx
```

**Pass if:**

* Exists
* Has `th_vid`, `session_key`, `session_start`, `page_type`
* Reload page → `th_vid` unchanged

**Fail → fix theme bootstrap.**

---

### 2 → Theme emits page signal

**Action:**

```js
window.dataLayer.filter(e => e.event === 'page_view').length
```

**Pass if:** exactly `1`

**Fail → duplicate emit in theme.**

---

### 3 → Web Pixel fires raw events

**Action:** Shopify Admin → Customer Events → Preview
Navigate page, add to cart.

**Pass if:** raw names appear (e.g. `page_viewed`, `product_added_to_cart`)

**Fail → fix web pixel subscription.**

---

### 4 → Collector accepts manual probe

**Action (terminal):**

```bash
curl -i -X POST https://pixel-ingest-dev-600339193870.us-central1.run.app/track \
  -H "content-type: application/json" \
  -H "x-terra-secret: $TERRA_SECRET" \
  -d '{"source":"manual_test","event_id":"flow-1","event":"ping","timestamp":"2025-01-01T00:00:00Z"}'
```

**Pass if:** `HTTP/2 204`

**Fail → auth/CORS/collector config.**

---

### 5 → Raw event persisted

**Action (BQ):**

```bash
bq query --use_legacy_sql=false <<'SQL'
SELECT event_id, JSON_VALUE(payload,'$.event') event
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE event_id='flow-1'
LIMIT 1;
SQL
```

**Pass if:** row exists, `event = ping`

**Fail → BigQuery insert/schema.**

---

### 6 → Shopify Pixel events persisted

**Action (BQ):**

```bash
bq query --use_legacy_sql=false <<'SQL'
SELECT source, event_name, COUNT(*) cnt
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE received_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)
GROUP BY source, event_name
ORDER BY cnt DESC;
SQL
```

**Pass if:** `source=shopify_pixel` with raw names

**Fail → pixel → collector wiring.**

---

### 7 → Identity carried through

**Action (BQ):**

```bash
bq query --use_legacy_sql=false <<'SQL'
SELECT th_vid, session_key, session_start
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE source='shopify_pixel'
ORDER BY received_at DESC
LIMIT 5;
SQL
```

**Pass if:** all three populated; same `th_vid` across rows

**Fail → storage bridge or pixel read.**

---

### 8 → CORS verified (browser)

**Action:** Inspect one `/track` response

**Pass if headers include:**

* `access-control-allow-origin: *`
* `access-control-allow-methods: post,options`
* `access-control-allow-headers: content-type,x-terra-secret`

**Fail → collector middleware.**

---

### 9 → No derivation at ingestion

**Action (BQ):**

```bash
bq query --use_legacy_sql=false <<'SQL'
SELECT COUNT(*) cnt
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE event_name LIKE '%purchase%' OR event_name LIKE '%view_item%';
SQL
```

**Pass if:** raw-only (no GA4 semantics)

**Fail → remove derivation in collector.**

---

### 10 → Freeze DEV

**Action:**

```bash
git tag -a dev-verified -m "DEV pipeline verified"
git push origin dev-verified
```

**Done.**

---

## Rule

If a step fails, **do not proceed**. Fix that layer, rerun **from the failing step forward**.
