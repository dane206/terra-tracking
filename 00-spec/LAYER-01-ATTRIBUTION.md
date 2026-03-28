# LAYER 01 — ATTRIBUTION (AUTHORITATIVE)

This document supersedes:
- 00-TERRA-SPINE-SPEC.md
- 01-TERRA-CODE-MAP.md
- 01-invariants.md
- 02-identity-contract.md
- 03-raw-event-ledger.md
- 04-event-ownership.md

Canonical system:

- ingestion endpoint: /v2/track
- schema: events_raw (BigQuery)
- identity: ctx_id, th_vid, session_key
- event_id: terra UUID (canonical)
- source_event_id: preserved (shopify)

No v1 endpoints exist.