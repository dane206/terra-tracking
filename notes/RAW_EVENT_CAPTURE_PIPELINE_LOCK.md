# RAW EVENT CAPTURE PIPELINE LOCK
→ This is not exploratory, not theoretical, not sprawling. Follow it top-to-bottom.
→ 15-minute final lock checklist (follow exactly)

---
## Goal (re-state clearly)
→ LOCK - RAW EVENT CAPTURE PIPELINE

### Browser (Theme + Shopify Pixel)
→ `pixel-ingest-dev` (public, CORS, no auth, always 204)
→ `terra-collector-dev` (private, secret, BigQuery)

---
## Minute 0–3 — Accept What Is Already Correct (no changes)
→ Do not “fix” noise. Raw means raw.

### Explicitly accept these as DONE:
→ `pixel-ingest-dev` returns 204 ✔
→ CORS works for:
	→ `Origin: https://terra-dev-plus-store.myshopify.com`
	→ `Origin: null` (Shopify pixel sandbox)
→ Events are flooding (input, click, checkout, etc.) ✔
→ `terra-collector-dev` is receiving forwarded events ✔
→ Console warnings exist but do not break flow ✔

---
## Minute 3–6 — One Final Code Sanity Check (no edits unless mismatch)

### A) `pixel-ingest-dev/index.js` (proxy)
→ Confirm only these properties exist:

```js
app.use(CORS_MIDDLEWARE_FIRST);        // ✔
app.use(express.json(...));            // ✔

POST /track:
  - validate event_id, event_name, timestamp
  - forward server-side with x-terra-secret
  - respond 204 ALWAYS

NO:
  - cookies
  - sessions
  - identity generation
  - filtering
  - GA logic
```
→ If that matches → DO NOT TOUCH.

### B) Theme raw page view sender (line ~424)
→ Confirm identity is READ, not CREATED:

```js
session_key: window.terra_ctx.session_key || null,
session_start: window.terra_ctx.session_start || null,
th_vid: window.terra_ctx.th_vid || null,
```
→ This is correct.
→ If identity is ever `null`, that means:
→ Script ran before identity snippet finished
→ That is acceptable in RAW capture
→ Do NOT block or delay send. Raw beats perfect.

### C) Shopify Pixel code
→ Confirm:
→ Uses `analytics.subscribe`
→ Sends only event data + timestamp
→ No cookies
→ No identity creation
→ No auth headers
→ If yes → lock it. ✔

---
## Minute 6–9 — Final Verification (one command, one screen)

### Run this one command (just confirm result):

```bash
curl -i -X POST "https://pixel-ingest-dev-600339193870.us-central1.run.app/track" \
  -H "Origin: https://terra-dev-plus-store.myshopify.com" \
  -H "Content-Type: application/json" \
  --data '{"event_id":"final-check","event_name":"final_check","timestamp":"2026-01-06T00:00:00.000Z"}'
```

### Required result:

```
HTTP/2 204
access-control-allow-origin: https://terra-dev-plus-store.myshopify.com
```
→ If yes → browser → proxy is DONE forever.

---
## Minute 9–11 — Save + Commit (no refactors)

### Only commit if files changed today:

```bash
git status
```
→ If `index.js` or theme snippets changed:

```bash
git add .
git commit -m "lock: raw event capture pipeline (public ingest → private collector)"
git push
```
→ If no changes, do nothing.

---
## Minute 11–13 — Write the Lock Note (this matters)
→ Create or update one doc:

### File: `RAW_EVENT_PIPELINE_LOCK.md`
→ Paste exactly this:

```md
# RAW EVENT PIPELINE — LOCKED
→ Architecture:

## Browser (Theme + Shopify Pixel)
→ `pixel-ingest-dev` (public, CORS, no auth, always 204)
→ `terra-collector-dev` (private, x-terra-secret required)
→ BigQuery raw tables

## Principles:
→ Raw capture only
→ No filtering in browser
→ No identity creation in proxy
→ Identity may be null on early events
→ Noise is expected and preserved
→ Meaning is created downstream

## Status:
LOCKED — DO NOT MODIFY WITHOUT EXPLICIT REASON
```
→ Commit it if added.

---
## Minute 13–15 — Mental Shutdown Checklist

Say yes to all of these:
→ I see events arriving ✔
→ I see identity when available ✔
→ I accept null identity early ✔
→ I accept noisy checkout telemetry ✔
→ I accept console warnings ✔
→ I am not debugging Shopify internals ✔
→ I am not inventing meaning too early ✔
→ If yes → stop working.

---
## Final Leadership Call (clear and direct)

Summary
→ You did not break anything.
→ You did not miss something fundamental.
→ You successfully crossed the hardest line:
→ From “analytics guessing” to “event truth.”
→ The discomfort you feel is exactly what happens when 
→ systems become correct instead of comforting.
