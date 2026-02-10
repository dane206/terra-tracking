⚠️ SUPERSEDED BY /00-spec/LAYER-01-ATTRIBUTION.md
Do not edit. Kept for historical reference.

# Identity and Sessions

**Applies to:** All events, all analytics  
**Source surfaces:** Shopify Theme (authoritative), Shopify Web Pixel, Shopify App Pixel  
**Status:** Canonical  
**Effective ctx_version:** 1.0.4

---

## Identity Model

### Visitor (`th_vid`)
- Globally unique identifier
- Lifetime-scoped (2 years)
- Stored as:
  - first-party cookie (authoritative)
  - sessionStorage (convenience)
  - localStorage (propagation bridge)

### Session (`session_key`)
- Unique per browsing session
- Stored in sessionStorage
- Reset on new browser session

### Session Start (`session_start`)
- ISO timestamp of session creation
- Stored alongside `session_key`

---

## Authority Hierarchy

1. **Theme Bootstrap**
   - Generates identity
   - Sets cookies and storage
2. **Web Pixel / App Pixel**
   - Reads identity
   - Must not generate identity
3. **Collector**
   - Accepts identity as provided
   - Never mutates identity

---

## Storage Responsibilities

| Storage        | Purpose                               |
|---------------|----------------------------------------|
| Cookie        | Cross-page, cross-reload persistence   |
| sessionStorage| Session continuity                     |
| localStorage  | Cross-surface propagation only         |

> localStorage is **not** authoritative.  
> It exists solely to bridge Shopify sandboxed surfaces.

---

## Required Fields (All Events)

- `th_vid`
- `session_key`
- `session_start`

Events without these fields are valid **raw events**, but cannot contribute to session analytics.

---

## Version Notes / Amendments (1.0.4)

- Identity propagation via `localStorage` formally documented
- Initial DEV state showed zero visitors/sessions until propagation was added
- No change to conceptual identity model from 1.0.3
