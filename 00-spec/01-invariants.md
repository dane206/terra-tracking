# 01_invariants.md

## Status
**LAW (Authoritative)**

This document defines **non-negotiable invariants** for the Terra tracking system.

If code, configuration, or documentation conflicts with this file, **this file wins**.

---

## What an Invariant Is

An **invariant** is a rule that must remain true **at all times**, regardless of:
- environment (DEV / PROD)
- surface (theme, web pixel, app pixel, server)
- downstream destination (GA4, Ads, BI)
- future refactors

If an invariant is violated, the system is considered **broken**, not “degraded.”

---

## Invariant 1 — Single Source of Truth (SSOT)

There is exactly **one SSOT for identity and page context**.

### Definition
- **SSOT location:** Shopify Theme (browser runtime)
- **Mechanism:** `terra_bootstrap` (identity bootstrap snippet)

### Implications
- Theme **creates** identity
- Other surfaces **consume** identity
- No other surface may invent, overwrite, or mutate identity

### Enforcement
- Web Pixel **must read** identity from storage
- Collector **must not generate** identity
- Derived systems **must not infer** identity

---

## Invariant 2 — Identity Keys Are Canonical

The following keys are **canonical identity keys**:

- `th_vid` — visitor identifier (long-lived)
- `session_key` — session identifier
- `session_start` — ISO timestamp of session start

### Rules
- Keys must be named **exactly** as above
- No aliases
- No renames
- No prefixes
- No suffixes

### Storage Rules
- Cookie: `th_vid`
- sessionStorage: `session_key`, `session_start`
- localStorage: **mirror only** (read-only copies)

---

## Invariant 3 — Raw Event Ledger Is Immutable

All raw events form an **append-only ledger**.

### Rules
Raw events:
- Are captured exactly as emitted
- Are stored permanently
- Are never renamed
- Are never suppressed
- Are never retroactively modified

### Prohibited Actions
- Dropping events due to “duplicates”
- Renaming raw `event_name`
- Normalizing raw payloads at ingestion
- Mutating historical rows

Derived logic happens **downstream only**.

---

## Invariant 4 — Event Identity Is Mandatory

Every ingested event **must** have an `event_id`.

### Rules
- `event_id` must be generated **at emission time**
- `event_id` must be a UUIDv4 string
- Collector **must not invent** missing `event_id`

### Consequences
- Events without `event_id` are invalid
- Invalid events may be rejected or quarantined
- Deduplication relies on `event_id`

---

## Invariant 5 — Raw vs Derived Separation

Raw events and derived events are **different classes of data**.

### Raw Events
- Represent what actually happened
- Match emitter semantics
- Are source-specific
- Live in the raw ledger

### Derived Events
- Represent interpretations
- May aggregate or split raw events
- May map to GA4 or Ads schemas
- Are stored separately

A derived event **must never replace** a raw event.

---

## Invariant 6 — Source Is Explicit

Every event must declare its emitting surface.

### Allowed `source` values
- `shopify_theme`
- `shopify_pixel`
- `shopify_app_pixel`
- `server`

### Rules
- No implicit source
- No inferred source
- No environment-specific naming

Source is part of the event’s identity.

---

## Invariant 7 — Collector Is Passive

The event collector is **not an analytics engine**.

### Collector Responsibilities
- Validate JSON
- Attach receipt metadata
- Persist raw events
- Enforce minimal contract (presence of required keys)

### Collector Must Not
- Create new events
- Rename events
- Generate identity
- Apply business logic
- Enforce GA4 semantics

---

## Invariant 8 — Time Semantics Are Preserved

Two timestamps are distinct and must never be conflated:

- `timestamp` — when the event occurred (emitter time)
- `received_at` — when the server received the event

### Rules
- `timestamp` comes from the emitter
- `received_at` is added by the collector
- Neither replaces the other

---

## Invariant 9 — Documentation Hierarchy

Only files under `/00-spec` define system law.

### Priority Order
1. `01_invariants.md`
2. `02_identity_contract.md`
3. `03_raw_event_ledger.md`
4. `04_event_ownership.md`

Anything outside `/00-spec`:
- Is implementation
- Is illustrative
- May change without redefining truth

---

## Invariant 10 — Violations Require Contract Change

If reality no longer matches these invariants:

- You **do not patch around it**
- You **do not silently diverge**
- You **update the contract first**

Then and only then may code change.

---

## Final Statement

These invariants exist to prevent:
- silent drift
- duplicated logic
- retroactive rewrites
- analytics gaslighting

They are intentionally strict.

If something feels “hard” because of these rules,
that friction is the system protecting itself.
