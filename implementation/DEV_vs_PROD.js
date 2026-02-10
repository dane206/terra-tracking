# Authoritative ingest URLs (final)

## DEV: https://pixel-ingest-dev-7ak5xlux7q-uc.a.run.app
lo: /Users/dane/projects/pixel-ingest-dev 
gh: https://github.com/dane206/pixel-ingest-dev 
cr: https://console.cloud.google.com/run/detail/us-central1/pixel-ingest-dev/source?project=terra-analytics-dev 
bq: terra-analytics-dev 
ds: raw_dev 
tn: events_raw

## PROD: https://pixel-ingest-prod-qsnxy5imeq-uc.a.run.app
lo: /Users/dane/projects/pixel-ingest-prod 
gh: https://github.com/dane206/pixel-ingest-prod 
cr: https://console.cloud.google.com/run/detail/us-central1/pixel-ingest-prod/source?project=terra-analytics-prod 
bq: terra-analytics-prod 
ds: raw 
tn: events_raw

1. google ads is loading twice v42
	a. https://www.googletagmanager.com/gtag/js?id=AW-654961066
	b. https://www.googletagmanager.com/gtag/js?id=AW-654961066&cx=c&gtm=4e61d1

2. merchant-center is loading twice v9
	a. https://www.googletagmanager.com/gtag/js?id=GT-WB5D87QK
	b. https://www.googletagmanager.com/gtag/js?id=GT-WB5D87QK&cx=c&gtm=4e61d1

3. Collector endpoint URL (exact) = ...
	curl -i https://pixel-ingest-dev-600339193870.us-central1.run.app/health
	curl -i https://pixel-ingest-dev-600339193870.us-central1.run.app/version
curl -i -X POST \
  "https://pixel-ingest-dev-600339193870.us-central1.run.app/v1/track" \
  -H "content-type: application/json" \
  --data '{"events":[{"source":"manual","event_name":"ping","event_id":"curl-proof-001","event_time":"2026-01-15T20:04:37Z"}]}'
curl -i -X POST \
  "https://pixel-ingest-dev-600339193870.us-central1.run.app/track" \
  -H "content-type: application/json" \
  --data '{"events":[{"source":"manual","event_name":"ping","event_id":"curl-proof-001","event_time":"2026-01-15T20:04:37Z"}]}'

```js
// =========================
// Checkout totals (Web Pixel)
// =========================

// Subtotal (before duties/shipping/taxes)
const subtotal = Number(checkout.subtotalPrice?.amount || 0);

// Total "value" (full total incl. taxes/duties/discounts/shipping)
const value = Number(checkout.totalPrice?.amount || 0);
const currency = checkout.currencyCode || null;

// Discount codes + their declared value (either money or percentage)
const discountCodes = (checkout.discountApplications || [])
  .filter(d => d.type === "DISCOUNT_CODE")
  .map(d => ({
    code: d.title || null,
    value_money: d.value?.amount != null ? Number(d.value.amount) : null,
    value_percent: d.value?.percentage != null ? Number(d.value.percentage) : null
  }));

// Total discount amount (actual total $ off, if present in your checkout object)
const discountsAmount = Number(checkout.discountsAmount?.amount || 0);

// Optional breakdown
const tax = Number(checkout.totalTax?.amount || 0);
const shipping = Number(checkout.shippingLine?.price?.amount || 0);
```
## Checkout transaction_id policy
`checkout_started`, `checkout_shipping_info_submitted`, `payment_info_submitted` → `transaction_id = checkout.id`
`checkout_completed` → `transaction_id = order.id` if present, else `checkout.id`

### Implementation (single function)
```js
function getTransactionIdForEvent(eventName, { checkout, order }) {
  const checkoutId = checkout?.id ? String(checkout.id) : null;
  const orderId = order?.id ? String(order.id) : null;

  switch (eventName) {
    case "checkout_started":
    case "checkout_shipping_info_submitted":
    case "payment_info_submitted":
      return checkoutId;

    case "checkout_completed":
      // If a real order exists, use it. Otherwise fall back to checkout id.
      return orderId || checkoutId;

    default:
      return orderId || checkoutId || null;
  }
}

// usage
const transaction_id = getTransactionIdForEvent(event_name, { checkout, order });

// keep these separately (don’t overload transaction_id)
const checkout_id = checkout?.id ? String(checkout.id) : null;
const order_id = order?.id ? String(order.id) : null;
const order_number = order?.orderNumber ?? order?.name ?? null;
```
### DEV vs PROD (single-screen reference)
`GET /version` 		→ 200
`GET /health`  		→ 200
`POST /v1/track` 	→ 204
`POST /track`    	→ 204
`GET /` 			→ 404
---
✅ DEV analytics
project = terra-analytics-dev
service = pixel-ingest-dev
region = us-central1
dataset = raw_dev
dataset = stg_dev
dataset = mart_dev
dataset = funnel_dev
---
✅ PROD analytics
project = terra-analytics-prod
service = pixel-ingest-prod
region = us-central1
dataset = raw
dataset = shopify_warehouse -> currently in project = terra-shopify-analytics
dataset = terra_marketing_raw -> currently in project = terra-shopify-analytics
dataset = terra_marketing_marts -> currently in project = terra-shopify-analytics
dataset = analytics_344887390 -> currently in project = ga4-terrahealth
---
✅ UNCLEAR analytics:
project = terra-shopify-analytics
dataset = shopify_analytics 		-> 40,000 rows
dataset = terra_raw_us_central1 	-> 4,000 rows
dataset = applovin_ads 				-> 751 rows / googlesheet
dataset = facebook_ads 				-> 751 rows / googlesheet
dataset = google_ads 				-> 751 rows / googlesheet
dataset = categories 				-> 11 csvs
dataset = coupons 					-> 11 csvs
dataset = variations 				-> 7 csvs
dataset = customers 				-> 4 csvs
dataset = products 					-> 4 csvs
dataset = refunds 					-> 4 csvs


---
## Minimal prod verification (HTTP + BigQuery)
BASE="https://pixel-ingest-prod-279703303694.us-central1.run.app"
ID="curl-prod-proof-XXX"
curl -i "$BASE/version"
curl -i "$BASE/health"
curl -i -X POST "$BASE/v1/track" -H "content-type: application/json" \
  --data "{\"events\":[{\"source\":\"manual\",\"event_name\":\"ping\",\"event_id\":\"$ID\",\"event_time\":\"2026-01-15T00:00:00Z\"}]}"

