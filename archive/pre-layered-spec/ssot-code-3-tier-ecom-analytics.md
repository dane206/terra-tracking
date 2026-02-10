## Module Map (3-Tier Ecom Analytics)

### 0. Project Skeleton / Meta

- [ ] **Repo structure defined**
  - `/etl/` (Python)
  - `/sql/` (BigQuery views)
  - `/shiny/` (R dashboard)
  - `/docs/` (architecture, data dictionary)
- [ ] **Environments + configs**
  - GCP project: `terra-shopify-analytics`
  - Service accounts + keys
  - .Renviron / .env templates (no secrets in repo)

---

### 1. Back-End: Data Store (BigQuery + GCS)

#### 1.1 Shopify Orders

- [x] **Raw orders storage**
  - Monthly tables: `shopify_warehouse.orders_24_04` … `orders_25_06`
  - Unified view: `shopify_warehouse.orders_all`
- [x] **Staging view**
  - `shopify_warehouse.stg_orders_line_items` (1 row per line item)
- [x] **Order marts**
  - `shopify_warehouse.orders_mart` (1 row per non-test order)
  - `shopify_warehouse.orders_daily_mart` (date, paid_orders, gross_revenue)
- [ ] **Data dictionary for orders**
  - Document meanings of key fields (order_date, financial_status, etc.)

#### 1.2 Other Core Entities (skeleton)

- [ ] **Customers**
  - Raw: `customers_*` tables
  - Staging view: `stg_customers`
  - Mart: `customers_mart` (first_order_date, latest_order_date, LTV skeleton)
- [ ] **Products / Variants**
  - Raw: `products_*`, `variations_*`
  - Staging: `stg_products`, `stg_variants`
  - Mart: `products_mart` (sku, item_id, item_group_id, categories)
- [ ] **Refunds / Chargebacks**
  - Raw: `refunds_*`
  - Staging: `stg_refunds`
  - Mart: `refunds_mart` (amount, reason, linked order_id)
- [ ] **Subscriptions (Smartrr)**
  - Raw: `smartrr_*`
  - Staging: `stg_subscriptions`
  - Mart: `subscriptions_mart` (start, cancel, status, MRR)

#### 1.3 Marketing / Events

- [ ] **Marketing spend**
  - Raw: `ads.*` datasets (Google Ads, etc.)
  - Staging: `stg_marketing_spend`
  - Mart: `marketing_spend_mart` (date, source, campaign, ad_group, creative, spend)
- [ ] **Event stream**
  - Raw: `events.*` or `terra_events.*`
  - Staging: `stg_events` (normalized fields, event_date, event_name, ids)
  - Mart: `events_mart` (filtered, deduped, tied to orders/customers when possible)

---

### 2. Middle Tier: Processing / Application

#### 2.1 ETL (Batch)

- [ ] **Shopify orders backfill job (Python)**
  - Pulls historical orders by date range
  - Writes JSONL to GCS
  - Loads into `shopify_warehouse.orders_YYYY_MM`
- [ ] **Shopify customers/products backfill job**
- [ ] **Smartrr subscriptions backfill job**
- [ ] **Marketing platform backfill jobs** (Google Ads, others)

#### 2.2 Incremental Updates

- [ ] **Daily incremental orders job**
  - Picks up new/updated orders
  - Appends to latest `orders_YYYY_MM`
- [ ] **Daily customers/products refresh**
- [ ] **Daily subscriptions + marketing refresh**

#### 2.3 Transform Logic (BigQuery SQL)

- [x] **Orders transforms**
  - `orders_all` → `stg_orders_line_items` → `orders_mart` → `orders_daily_mart`
- [ ] **Customers transforms**
- [ ] **Products transforms**
- [ ] **Refunds / chargebacks transforms**
- [ ] **Subscriptions transforms**
- [ ] **Events + attribution transforms**
  - Define first_touch / last_touch rules
  - Join events ↔ orders ↔ marketing_spend

#### 2.4 Optional API Layer (later)

- [ ] **Metrics API (Node/Express on Cloud Run)**
  - Read-only endpoints (e.g., `/metrics/daily-revenue`, `/metrics/cohorts`)
  - Used by non-Shiny clients (future)

---

### 3. Front-End: Analytics / BI (R + Shiny)

#### 3.1 Shiny App Skeleton

- [ ] **Base Shiny app**
  - Project: `terra-r-dashboard`
  - BigQuery connection via `terra-dashboard-key.json`
  - Global config for project/dataset

#### 3.2 MVP Dashboards

- [ ] **Daily Revenue View (v1)**
  - Source: `shopify_warehouse.orders_daily_mart`
  - Inputs: date range
  - Outputs: table + line chart (gross_revenue, paid_orders)
- [ ] **Orders Detail View**
  - Source: `shopify_warehouse.orders_mart`
  - Filters: date range, financial_status, test flag
  - Outputs: table with order-level fields
- [ ] **Product / SKU performance**
  - Source: `stg_orders_line_items` / future `order_items_mart`
  - Metrics: revenue by sku/product over time
- [ ] **Customer overview**
  - Source: `customers_mart`
  - Metrics: LTV, orders per customer, cohorts (skeleton)

#### 3.3 Later Views

- [ ] **Profitability view**
  - Join orders + COGS + shipping + refunds + marketing_spend
- [ ] **Cohort / LTV curves**
  - Cohorts by first_order_date, first_product, first_campaign
- [ ] **Attribution view**
  - First_touch vs last_touch vs blended

---

### 4. Backfill, Gaps, and Ops

- [ ] **Document known gaps**
  - Orders gap: post-2025-07-01 (no monthly tables yet)
  - Any missing refunds/subscriptions/ad data
- [ ] **Backfill plan**
  - Re-run Shopify orders ETL for missing months
  - Rebuild marts (views auto-extend once raw is populated)
- [ ] **BigQuery cost controls**
  - Partitioned tables (by event_date/order_date where applicable)
  - Query patterns: always filter by date + select only needed columns
  - Billing alerts and daily budget caps
- [ ] **Monitoring**
  - Basic checks: row counts per day/month
  - Simple “data freshness” query for dashboard (latest order_date, latest event_date)

---
