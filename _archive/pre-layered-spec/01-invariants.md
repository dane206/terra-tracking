⚠️ SUPERSEDED BY /00-spec/LAYER-01-ATTRIBUTION.md
Do not edit. Kept for historical reference.

Below is a **fully vetted, internally consistent, canonical version** of `01_invariants.md`.

This version:

* Aligns **exactly** with the system you built
* Removes hidden contradictions
* Clarifies collector behavior without weakening the law
* Requires **no code changes**

This **replaces** the prior file.

---

# 01_invariants.md

## Status

**LAW (Authoritative)**

This document defines **non-negotiable invariants** for the Terra tracking system.

If code, configuration, or documentation conflicts with this file, **this file wins**.

---

## What an Invariant Is

An **invariant** is a rule that must remain true **at all times**, regardless of:

* environment (DEV / PROD)
* surface (theme, custom pixel, app pixel, server)
* downstream destination (GA4, Ads, BI)
* refactors or migrations

If an invariant is violated, the system is considered **broken**, not “degraded.”

---

## Invariant 1 — Single Source of Truth (SSOT)

There is exactly **one SSOT for identity and page context**.

### Definition

* **SSOT location:** Shopify Theme (browser runtime)
* **Mechanism:** `terra_bootstrap` identity bootstrap

### Implications

* Theme **creates** identity
* Other surfaces **consume** identity
* No other surface may invent, overwrite, or mutate identity

### Enforcement

* Web Pixels **must read** identity from storage
* Collector **must not generate** identity
* Derived systems **must not infer** identity

---

## Invariant 2 — Identity Keys Are Canonical

The following keys are **canonical identity keys**:

* `th_vid` — visitor identifier (long-lived)
* `session_key` — session identifier
* `session_start` — ISO-8601 timestamp of session start

### Rules

* Keys must be named **exactly** as above
* No aliases
* No renames
* No prefixes or suffixes

### Storage Rules

* Cookie: `th_vid`
* `sessionStorage`: `session_key`, `session_start`
* `localStorage`: mirror only (read-only copies)

---

## Invariant 3 — Raw Event Ledger Is Immutable

All raw events form an **append-only ledger**.

### Rules

Raw events:

* Are captured exactly as emitted
* Are stored permanently
* Are never renamed
* Are never suppressed
* Are never retroactively modified

### Prohibited Actions

* Dropping events due to “duplicates”
* Renaming raw event names
* Normalizing payloads at ingestion
* Mutating historical rows

All derivation happens **downstream only**.

---

## Invariant 4 — Event Identity Is Mandatory

Every ingested event **must** have an `event_id`.

### Rules

* `event_id` must be generated **at emission time**
* `event_id` must be a UUIDv4 string
* Collector **must not invent** an `event_id`

### Consequences

* Events missing `event_id` are **invalid**
* Invalid events may be rejected or quarantined
* Deduplication relies on `event_id` exclusively

---

## Invariant 5 — Raw vs Derived Separation

Raw events and derived events are **different classes of data**.

### Raw Events

* Represent what actually happened
* Match emitter semantics
* Are surface-specific
* Live only in the raw ledger

### Derived Events

* Represent interpretations
* May aggregate or split raw events
* May map to GA4 / Ads schemas
* Are stored separately

A derived event **must never replace** a raw event.

---

## Invariant 6 — Source Is Explicit

Every stored event **must have an explicit `source`**.

### Allowed `source` values

* `shopify_theme`
* `shopify_pixel`
* `shopify_app_pixel`
* `manual_test`

### Rules

* No implicit source at rest
* No inferred source downstream
* No environment-specific naming

### Enforcement Clarification

* Emitters **should** provide `source`
* Collector **may enforce or default** `source` if missing
* Stored events **must always** have `source` populated

This preserves explicit provenance without brittle emitters.

---

## Invariant 7 — Collector Is Passive

The event collector is **not an analytics engine**.

### Collector Responsibilities

* Validate JSON
* Attach receipt metadata
* Persist raw events
* Enforce minimal contract (presence of required keys)

### Collector Must Not

* Create new events
* Rename events
* Generate identity
* Apply business logic
* Enforce GA4 or Ads semantics

---

## Invariant 8 — Time Semantics Are Preserved

Two timestamps are distinct and must never be conflated:

* `timestamp` — when the event occurred (emitter time)
* `received_at` — when the server received the event

### Rules

* `timestamp` comes from the emitter
* `received_at` is added by the collector
* Neither replaces the other
* Ordering uses `received_at`; semantics use `timestamp`

---

## Invariant 9 — Documentation Hierarchy

Only files under `/00-spec` define system law.

### Priority Order

1. `01_invariants.md`
2. `02_identity_contract.md`
3. `03_raw_event_ledger.md`
4. `04_event_ownership.md`

Anything outside `/00-spec`:

* Is implementation
* Is illustrative
* May change without redefining truth

---

## Invariant 10 — Violations Require Contract Change

If reality no longer matches these invariants:

* You **do not patch around it**
* You **do not silently diverge**
* You **update the contract first**

Only then may code change.

---

## Final Statement

These invariants exist to prevent:

* silent drift
* duplicated logic
* retroactive rewrites
* analytics gaslighting

They are intentionally strict.

If something feels “hard” because of these rules,
that friction is the system protecting itself.

---

**Status: Canonical. Aligned with runtime reality. Locked.**
