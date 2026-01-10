# GTM – Storefront → GA4 (Canonical)

This directory defines the **final, authoritative GTM configuration**
for Shopify storefront → GA4 tracking.

Scope:
- Shopify storefront only
- Theme → dataLayer → GTM → GA4
- No checkout
- No Web Pixel
- No server-side

---

## What This GTM Container Does

- Listens only to explicit `dataLayer` events emitted by the theme
- Routes those events to GA4 without reshaping or inference
- Does **not** create, infer, or reshape ecommerce or promotion objects
- Does **not** synthesize events
- Does **not** infer page or ecommerce context

---

## Final Counts

- **7 Tags**
- **7 Triggers**
- **26 User-Defined Variables**
- **1 Constant**
- **6 Built-In Variables enabled (read-only)**

Anything not documented in this folder is **out of scope** and may be deleted.

---

## Event Flow

Theme → `dataLayer.push()`  
→ GTM Custom Event Trigger  
→ GA4 Event Tag  
→ GA4

No other paths exist.

---

## Non-Negotiables

- No DOM Ready triggers
- No Page View triggers
- No regex triggers
- No JS variables
- No inferred parameters
- No checkout events

This configuration is **locked** unless the dataLayer contract changes.
