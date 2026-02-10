🧱 Step 1: High-Level Architecture Overview

🔄 Event Flow Architecture
Shopper's Browser (Shopify Storefront)
   │
   └──▶ Shopify Web Pixel (Your Pixel Extension)
           │
           └──▶ POST to Your Backend Ingestion Endpoint
                   │
                   ├──▶ Queue / Buffer (optional: Kafka, SQS, PubSub)
                   │
                   └──▶ Event Processor
                          │
                          ├──▶ Validation & Deduplication
                          ├──▶ Enrichment (lookup product, user, campaign info)
                          └──▶ Store in:
                                  - Analytics DB (e.g., BigQuery, Redshift)
                                  - Data Lake (S3, GCS)
                                  - Real-time pipelines (e.g., Segment, Mixpanel)

Optional:
   └──▶ Shopify Webhooks (server-to-server order confirmations)

🧬 Step 2: Schema-First Design

🎯 Event Schema: ShopifyPixelEvent
{
  "event_id": "c2971d96-73cd-42c0-93d3-3e0bd9f0a100",  // UUID
  "timestamp": "2024-01-01T12:00:00Z",                 // ISO-8601
  "event_name": "checkout_started",                    // canonical event name
  "source": "shopify_pixel",                           // event source (e.g., pixel, webhook)

  "shopify_event": "checkout_started",                 // raw name from Shopify
  "shop_domain": "example.myshopify.com",              // current shop domain

  "checkout_token": "abc123",                          // available in many checkout/cart events
  "cart_token": "xyz456",                              // if available
  "customer_id": null,                                 // if captured/available
  "customer_email": null,                              // if available (optional, privacy-sensitive)

  "user_agent": "Mozilla/5.0 (Macintosh...)",          // from browser
  "referrer": "https://google.com",                    // from browser
  "url": "https://example.com/checkout",               // browser location.href
  "ip_address": "123.123.123.123",                     // only available if server captures

  "utm": {
    "source": "google",
    "medium": "cpc",
    "campaign": "spring_sale",
    "term": "shoes",
    "content": "ad_1"
  },

  "product": {
    "id": "gid://shopify/Product/1234567890",
    "variant_id": "gid://shopify/ProductVariant/987654321",
    "title": "Air Max 90",
    "price": 129.99,
    "quantity": 1
  },

  "metadata": {
    "platform": "shopify",
    "pixel_version": "1.0.0",
    "extension": "terra-app"
  }
}

🎯 Key Event Types
| Shopify Event                     | Canonical Event Name | Key Fields to Expect                       |
| --------------------------------- | -------------------- | ------------------------------------------ |
| `product_added_to_cart`           | `add_to_cart`        | `product`, `cart_token`                    |
| `product_removed_from_cart`       | `remove_from_cart`   | `product`, `cart_token`                    |
| `checkout_started`                | `begin_checkout`     | `checkout_token`, `cart_token`             |
| `checkout_completed`              | `purchase`           | `checkout_token`, `order_id` 			    |
| `checkout_contact_info_submitted` | `add_contact_info`   | `checkout_token`, `cart_token`            	|
| `checkout_address_info_submitted` | `add_address_info`   | `checkout_token`, `cart_token`            	|
| `payment_info_submitted`          | `add_payment_info`   | `payment method`, `cart_token`				|

✅ Option 1: Raw Event Log (Immutable)
Append-only log of every event.

```sql
CREATE TABLE raw_events (
  event_id UUID,
  timestamp TIMESTAMP,
  event_name TEXT,
  checkout_token TEXT,
  cart_token TEXT,
  shop_domain TEXT,
  payload JSONB
);
```

✅ Option 2: Normalized Analytics Schema
Tables like carts, checkouts, purchases, customers
Use event stream to populate dimensions + facts.

🧪 Event Deduplication Strategy
Each event has a event_id (UUID v4):
Use it to dedupe events in the backend.
Optionally combine with a secondary key (e.g., event_name + timestamp + checkout_token).
Store a first_seen_at and last_seen_at timestamp in your DB.

🔁 Enrichment Strategy (on the backend)
Use your backend to add additional context to events:
Map checkout_token to order_id (via webhook).
Lookup UTM params from session store (if not passed in payload).
Lookup customer info from Shopify Admin API (if customer is logged in).
Join with product catalog to enrich with SKU, category, etc.

📊 Analytics & Downstream Usage
Once events are stored and cleaned:
Visualize in BI tools (Metabase, Looker, etc.)
Pipe into Segment / Mixpanel / Amplitude
Train ML models for funnel optimization,LTV prediction, etc.

✅ Summary: Your Schema-First Event Model
Canonical event shape (event_id, timestamp, event_name)
Flexible optional fields (checkout_token, cart_token, etc.)
Raw + normalized storage in your backend
Validated and enriched server-side
Works with client-side pixels and server-side webhooks
Next Steps?
Let me know if you'd like to:
Map Shopify Webhook payloads into the same schema
Design the backend ingestion API to receive these events
Set up a queue/worker pattern to decouple frontend from DB writes
Create tracking/debug tools to verify event flow end-to-end

📦 Project: shopify-pixel-tracker

🧱 High-Level Architecture
Shopify Storefront (Browser)
    │
    └──▶ Shopify Web Pixel Extension (client-side JS)
              │
              └──▶ POST events to your backend (via browser.fetch)
                          │
                          ├──▶ Validate + Deduplicate
                          ├──▶ Enrich with metadata (UTMs, catalog, etc.)
                          └──▶ Store in DB / Analytics Platform

Optional:
Shopify Webhooks (orders/create, etc.) supplement server-side confirmations

🎯 Goals of This Project
Capture cart and checkout events using Shopify’s pixel extension system.
Send event data in real time to a custom reporting endpoint.
Design a schema-first, extensible event format for long-term data processing.
Be ES5-compliant to ensure compatibility with Shopify’s runtime.
Support future expansion (enrichment, deduplication, analytics).

shopify-pixel-tracker/
├── extension/
│   └── index.js               # ES5-compatible Web Pixel script
├── schema/
│   └── event.schema.json      # JSON schema for events
├── server/
│   ├── index.js               # Example Node.js ingestion server
│   └── README.md              # Setup instructions
├── README.md

📁 Folder Structure
shopify-pixel-tracker/
├── extension/
│   └── index.js               # ES5-compatible Web Pixel script
├── schema/
│   └── event.schema.json      # JSON schema for events
├── server/
│   ├── index.js               # Example Node.js ingestion server
│   └── README.md              # Setup instructions
├── README.md


📦 extension/index.js — Shopify Pixel Extension (ES5)
import { register } from "@shopify/web-pixels-extension";

register(function (ctx) {
  var analytics = ctx.analytics;
  var browser = ctx.browser;
  var settings = ctx.settings || {};

  if (!analytics || !browser || !settings.crEndpoint) {
    console.warn("[terra-app] Missing analytics, browser, or crEndpoint — pixel not initialized.");
    return;
  }

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function get(obj, path, fallback) {
    try {
      var parts = path.split(".");
      for (var i = 0; i < parts.length; i++) {
        obj = obj[parts[i]];
        if (obj === undefined || obj === null) return fallback;
      }
      return obj;
    } catch (_) {
      return fallback;
    }
  }

  function post(eventName, e) {
    var payload = {
      event: eventName,
      event_id: uuidv4(),
      timestamp: e.timestamp,
      shopify_event: e.name,
      checkout_token: get(e, "data.checkout.token", null),
      shop_domain: get(ctx, "shop.domain", null),
      path: get(browser, "location.pathname", null),
      user_agent: browser.userAgent || null
    };

    try {
      console.log("[terra-app] Sending event:", eventName, payload);

      browser.fetch(settings.crEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        keepalive: true,
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("[terra-app] Failed to send event:", eventName, err);
    }
  }

  console.log("[terra-app] Shopify cart + checkout standard events armed");

  var eventMap = [
    { shopifyEvent: "product_added_to_cart", customName: "product_added_to_cart" },
    { shopifyEvent: "cart_viewed", customName: "cart_viewed" },
    { shopifyEvent: "product_removed_from_cart", customName: "product_removed_from_cart" },
    { shopifyEvent: "checkout_started", customName: "checkout_started" },
    { shopifyEvent: "checkout_contact_info_submitted", customName: "checkout_contact_info_submitted" },
    { shopifyEvent: "checkout_address_info_submitted", customName: "checkout_address_info_submitted" },
    { shopifyEvent: "checkout_shipping_info_submitted", customName: "checkout_shipping_info_submitted" },
    { shopifyEvent: "payment_info_submitted", customName: "payment_info_submitted" },
    { shopifyEvent: "checkout_completed", customName: "checkout_completed" }
  ];

  for (var i = 0; i < eventMap.length; i++) {
    (function (eventItem) {
      analytics.subscribe(eventItem.shopifyEvent, function (e) {
        console.log("[terra-app] " + eventItem.shopifyEvent);
        post(eventItem.customName, e);
      });
    })(eventMap[i]);
  }
});

📄 schema/event.schema.json — Event Schema (v1)
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Shopify Pixel Event",
  "type": "object",
  "properties": {
    "event_id": { "type": "string", "format": "uuid" },
    "timestamp": { "type": "string", "format": "date-time" },
    "event": { "type": "string" },
    "shopify_event": { "type": "string" },
    "checkout_token": { "type": ["string", "null"] },
    "shop_domain": { "type": ["string", "null"] },
    "path": { "type": ["string", "null"] },
    "user_agent": { "type": ["string", "null"] }
  },
  "required": ["event_id", "timestamp", "event"]
}

🔌 server/index.js — Example Ingestion Endpoint
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/collect", (req, res) => {
  const event = req.body;

  console.log("🔵 Received Event:", JSON.stringify(event, null, 2));

  // TODO: validate against schema
  // TODO: persist to DB or message queue

  res.status(200).json({ status: "ok", received: true });
});

app.listen(port, () => {
  console.log(`✅ Listening for pixel events at http://localhost:${port}/collect`);
});

🛠 server/README.md — Running Locally
# Pixel Event Collector (Server)
## ✅ Run locally

```bash
cd server
npm install
node index.js
🧪 Test
Use Postman or curl:

curl -X POST http://localhost:3000/collect \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "test-id",
    "timestamp": "2024-01-01T00:00:00Z",
    "event": "checkout_started"
  }'
  
---

## 📘 `README.md` — Root Project Overview

```markdown
# Shopify Pixel Tracker

Collect Shopify storefront events (cart, checkout, purchase) using a custom Web Pixel Extension, and send them to a backend endpoint for analytics or logging.

## 🧱 Architecture

- **Client:** Shopify Web Pixel Extension (runs in browser)
- **Backend:** Node.js ingestion server (or your own stack)
- **Schema-first:** Validates events before storing

## 🧪 Events Captured

- product_added_to_cart
- cart_viewed
- product_removed_from_cart
- checkout_started
- checkout_contact_info_submitted
- checkout_address_info_submitted
- checkout_shipping_info_submitted
- payment_info_submitted
- checkout_completed

## 🛠 Deployment

- Add the `index.js` pixel to your Shopify custom pixel extension.
- Deploy your server (`/server`) to a platform like:
  - AWS Lambda + API Gateway
  - Vercel / Netlify Functions
  - Express + Docker container
- Set the `crEndpoint` setting to your deployed collector URL.

## 🔒 Security & Privacy

- Validate all payloads against `event.schema.json`
- Hash or drop PII if required
- Respect regional consent laws (GDPR, CCPA, etc.)

## 🔁 Optional Enhancements

- Add webhook-based server-side reconciliation
- Enrich events with UTM, product, customer metadata
- Store in a data warehouse or analytics pipeline

✅ Final Notes

You now have a complete tracking system starting from Shopify storefront → backend ingestion → schema enforcement.
It’s designed to scale and evolve (e.g., batching, retries, deduplication, enrichment).
You can plug this into any analytics stack or build your own reporting/dashboard layer.
Let me know if you’d like:
Dockerized version of the server
A webhook handler for orders/create
Schema validation with something like ajv
GitHub Actions workflow to deploy the extension or server

1) What data is sent
Version A
analytics.subscribe("checkout_started", function (event) {
  post("checkout_started", event);
});

Posts the entire Shopify pixel event object as-is (whatever Shopify gives you for that event).
Payload shape is “raw Shopify event”, typically includes lots of nested fields you may not want, and can change as Shopify updates.
Version B
analytics.subscribe("checkout_started", function (ev) {
  var checkout = ev && ev.data && ev.data.checkout ? ev.data.checkout : null;
  if (!checkout) return;
  postEvent("terra_begin_checkout", "checkout_started", checkout);
});

Extracts only ev.data.checkout.
Sends a curated/normalized payload: you’re explicitly sending checkout-only data into your own schema via postEvent(...).
You control the data contract more tightly.

2) Event naming and schema intent
Version A: event name = "checkout_started" (Shopify native) and raw payload.
Version B: has two names:
"terra_begin_checkout" = your canonical/internal event name (normalized)
"checkout_started" = the source/native event name (provenance)
payload = checkout only
This is the exact difference between “raw event forwarding” vs “schema-first canonical event system”.

3
Yes — if the goal is to get **closer to source data**, you want to treat Metorik as *a helpful reference*, but build your own “truth” from **Shopify + ads platforms** (Meta/Google), then compute the cohort tables yourself.
Here’s the clean mental model:
## Where the data should come from (and why)
### 1) Shopify = the source of customer + order truth

This is where you get:

* **who the customer is**
* **their first order date** (to assign `iso_week`)
* **what they bought** (variant: 1/2/3 bottle, OTP vs SUB)
* **revenue, refunds, discounts, taxes, shipping**
* **profit inputs** (COGS, fees, shipping cost rules)

You’ll extract from Shopify Admin API (GraphQL is usually best for rich order + refund detail). Shopify has first-class objects for **Orders** and **Refunds** in the Admin GraphQL API. ([Shopify][1])

**Minimum Shopify entities you’ll need**

* Orders (+ line items)
* Customers
* Refunds / transactions (so profit is net, not gross) ([Shopify][2])

### 2) Subscription platform (if OTP vs SUB is not fully reliable in Shopify)

Depending on your stack (Recharge/Skio/Stripe Subscriptions), you may need this to tag:

* **first purchase was a subscription vs one-time**
* subscription renewals / churn

(If your Shopify order tags/line item properties already include this cleanly, you can avoid a separate feed.)

### 3) Meta + Google Ads = acquisition cost + campaign metadata

This is where you get:

* **spend, impressions, clicks**
* **campaign/adset/ad metadata**
* (optionally) platform-reported conversions (less “truthy,” but useful)

Meta reporting is via the Marketing API Insights endpoints. ([Facebook for Developers][3])
Google Ads reporting is via the Google Ads API using GAQL queries and conversion metrics. ([Google for Developers][4])

### 4) Attribution layer (optional but usually necessary)

To link a Shopify order/customer to a specific adset/campaign reliably, you typically need:

* UTMs (`utm_source`, `utm_campaign`, etc.)
* click IDs (`gclid`, `fbclid`) where available
* or a tool like Northbeam/TW/Rockerbox

Without this, you can still build product/variant cohort LTP, but CAC by adset becomes fuzzy.

---

## The practical “pipeline” to make this real

### Option A: Use an ETL connector (recommended)
Tools like Airbyte/Fivetran/Stitch pull Shopify/Meta/Google into your warehouse on a schedule. Airbyte, for example, has a Shopify source that syncs Orders + Order Refunds etc. ([Airbyte Docs][5])

### Option B: Build direct API pulls
* Shopify Admin GraphQL for orders/refunds ([Shopify][1])
* Meta Insights API ([Facebook for Developers][3])
* Google Ads API (GAQL reporting) ([Google for Developers][4])

## What you’ll compute from that raw data (the “model-ready” layer)
You’ll create your own tables like:
**`cohort_variant_week`**
* `product`
* `variant` (1/2/3 bottle × OTP/SUB)
* `iso_week` (e.g., 2026_W03)
* `new_customers`
* `ltp_week_1 … ltp_week_18`
* optional: `cac`, `adset`, `channel`

Then the dashboard/model can run for *any product / any time*.
---

## What you should verify in Shopify right now (checklist)
1. Can we reliably identify **first order** per customer?
2. Can we reliably label **variant** from line items (bundle size) + subscription flag?
3. Do we have a consistent way to compute **profit** (COGS + shipping + fees + refunds)?
   Refund details matter; Shopify exposes Refund objects. ([Shopify][2])
4. Are UTMs / click IDs stored in Shopify (order landing page, checkout attributes, notes, etc.) so we can later join to ad platforms?

---
