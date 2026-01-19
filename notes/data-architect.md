                    ┌──────────────────────────-─┐
                    │   ga4-terrahealthe-*       │
                    │   (GA4 managed)            │
                    │   BigQuery exports only    │
                    └────────────┬──────────────-┘
                                 │ READ
                                 ▼

DEV
Cloud Run service [pixel-ingest-dev] in
project [terra-analytics-dev] in
region [us-central1]

┌───────────────────────────┐   ┌────────────────-───────────┐
│ terra-analytics-dev       │   │ terra-analytics-prod       │
│ (YOU OWN THIS)            │   │ (YOU WILL CREATE THIS)     │
│                           │   │                            │
│  Cloud Run                │   │  Cloud Run                 │
│   └─ `pixel-ingest-dev`     │   │   └─ pixel-ingest-prod     │
│                           │   │                            │
│  BigQuery                 │   │  BigQuery                  │
│   ├─ `raw_dev.events_raw`   │   │   ├─ raw_prod.events_raw   │
│   └─ stg_dev.events_stg   │   │   └─ stg_prod.events_stg   │
└────────────┬──────────────┘   └────────────-─────────────-─┘
             │ READ                               │ READ
             ▼                                    ▼
        ┌────────────────────────────────────────────┐
        │ terra-shopify-analytics                    │
        │ (REPORTING / ANALYSIS ONLY)                │
        │                                            │
        │ BigQuery views, marts, dashboards          │
        └────────────────────────────────────────────┘

[ Theme Bootstrap ]
  └─ `terra_identity_ready`  ← authoritative identity
  └─ `page_view`             ← canonical analytics
  └─ `view_item_list`        ← canonical ecommerce
  └─ `view_item`
  └─
  └─
  └─

[ Shopify Web Pixel ]
  └─ `page_viewed`           ← raw behavioral signal (this payload)

[ `pixel-ingest-dev` ]
  └─ receives raw signal
  └─ forwards safely

[ `terra-collector` ]
  └─ stores raw
  └─ joins by th_vid + time
  └─ produces truth


INGEST → RAW → STG → MART → FUNNELS / FACTS

✅ 1. INGEST (DONE)
`pixel-ingest-dev` - Cloud Run service
- Accepts POST /track
- Always returns 204
- No logic, no shaping

Purpose:
- Get events into BigQuery without loss.
✔️ Complete
✔️ Frozen

✅ 2. RAW (DONE)
`raw_dev.events_raw` - Append-only ledger.

Columns (locked):
- received_at
- data_source
- event_name
- event_id
- event_time
- raw (stringified JSON)

Purpose:
- Durable source of truth. Never trusted for analytics.
✔️ Complete
✔️ Frozen



