```markdown
# Terra Tracking — DEV Verification Runbook

**System:** Terra Tracking  
**Environment:** DEV  
**Purpose:** Verify the raw event pipeline end-to-end  
**Status:** Canonical verification procedure

> **Rule:** If a step fails, **stop**. Fix that layer. Resume at the failing step.  
> Do not skip steps. Do not “assume it works.”

---

## STEP 0 — Confirm Environment (DEV)

### 0.1 Shopify Store
**Check:** Browser URL  
**Pass:**  
```

[https://terra-dev-plus-store.myshopify.com](https://terra-dev-plus-store.myshopify.com)

```

---

### 0.2 Collector Endpoint
**Pass:** All browser pixels and curl tests target:
```

[https://pixel-ingest-dev-](https://pixel-ingest-dev-)<project>.us-central1.run.app/track

````

---

### 0.3 BigQuery Dataset Exists
```bash
bq show terra-analytics-dev:raw_dev.shopify_pixel_events
````

**Pass:** Command succeeds (table metadata returned)

---

### 0.4 Collector Secret Present

```bash
gcloud run services describe pixel-ingest-dev \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

**Pass:** `TERRA_SECRET` exists and is non-empty

---

### 0.5 Auth Enforcement

**Without secret**

```bash
curl -i -X POST https://pixel-ingest-dev-…/track \
  -H "content-type: application/json" \
  -d '{"event_id":"x","event":"ping"}'
```

**Pass:** `401 Unauthorized`

**With secret**

```bash
curl -i -X POST https://pixel-ingest-dev-…/track \
  -H "content-type: application/json" \
  -H "x-terra-secret: $TERRA_SECRET" \
  -d '{"source":"manual_test","event_id":"x2","event":"ping"}'
```

**Pass:** `204 No Content`

---

## STEP 1 — Theme Identity SSOT

In browser console:

```js
window.terra_ctx
```

**Pass:**

* Object exists
* Contains `th_vid`, `session_key`, `session_start`

Reload page:

**Pass:**

* `th_vid` remains the same
* `session_key` unchanged unless session reset

---

## STEP 2 — Single Page Signal

In browser console:

```js
window.dataLayer.filter(e => e.event === 'page_view').length
```

**Pass:**

```
1
```

No duplicates.

---

## STEP 3 — Shopify Web Pixel Emits Raw Events

**Action:**

* Shopify Admin → Customer Events → Preview
* Browse site
* Add product to cart
* View cart

**Pass:** Pixel emits **raw** Shopify event names only:

* `page_viewed`
* `product_viewed`
* `product_added_to_cart`
* `cart_viewed`
* etc.

No GA4-style names.

---

## STEP 4 — Collector Accepts Manual Event

```bash
curl -i -X POST https://pixel-ingest-dev-…/track \
  -H "content-type: application/json" \
  -H "x-terra-secret: $TERRA_SECRET" \
  -d '{"source":"manual_test","event_id":"flow-1","event":"ping"}'
```

**Pass:**

```
204 No Content
```

---

## STEP 5 — Manual Event Persisted

```bash
bq query --use_legacy_sql=false <<'SQL'
SELECT
  event_id,
  JSON_VALUE(payload,'$.event') AS event
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE event_id = 'flow-1';
SQL
```

**Pass:**

* Exactly one row
* `event = ping`

---

## STEP 6 — Shopify Pixel Events Persisted

```bash
bq query --use_legacy_sql=false <<'SQL'
SELECT source, event_name, COUNT(*) AS cnt
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE received_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)
GROUP BY source, event_name
ORDER BY cnt DESC;
SQL
```

**Pass:**

* `source = shopify_pixel`
* Raw event names only
* Non-zero counts

---

## STEP 7 — Identity Carried Through

```bash
bq query --use_legacy_sql=false <<'SQL'
SELECT th_vid, session_key, session_start
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE source = 'shopify_pixel'
ORDER BY received_at DESC
LIMIT 5;
SQL
```

**Pass:**

* All fields populated
* Same `th_vid` across events in session

---

## STEP 8 — CORS Headers

Inspect any `/track` response.

**Pass (exact headers):**

```
access-control-allow-origin: *
access-control-allow-methods: post,options
access-control-allow-headers: content-type,x-terra-secret
```

---

## STEP 9 — No Derived Semantics at Ingestion

```bash
bq query --use_legacy_sql=false <<'SQL'
SELECT COUNT(*) AS cnt
FROM `terra-analytics-dev.raw_dev.shopify_pixel_events`
WHERE event_name LIKE '%purchase%'
   OR event_name LIKE '%view_item%';
SQL
```

**Pass:**

```
0
```

Raw ledger contains **no GA4-derived events**.

---

## STEP 10 — Freeze State

```bash
git tag -a dev-verified -m "DEV raw event pipeline verified"
git push origin dev-verified
```

**Pass:** Tag exists remotely.

---

# Notes

* This runbook verifies **plumbing**, not business meaning.
* No attribution, no GA4 validation, no optimization checks.
* Any failure indicates a **contract or wiring violation**, not “noise.”

---

**End of Runbook**

```
```
