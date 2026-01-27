# 2️⃣ Architecture Diagram (Text / Mermaid)

You can paste this into GitHub, Obsidian, or any Mermaid-enabled tool.

```mermaid
flowchart LR
    A[Shopify Storefront] --> B[dataLayer]
    B --> C[GTM]

    C -->|GA4| D[GA4]
    C -->|Business Events| E[Terra Ingest]

    E --> F[BigQuery Raw Ledger]

    F --> G[Derived SQL Views]
    G --> H[Dashboards / Analysis]

    subgraph Storefront (Frozen)
        A
        B
        C
    end

    subgraph Traffic
        D
    end

    subgraph Business Ledger
        E
        F
    end
```

### Key Properties

* **GA4** owns traffic (`page_view`)
* **Terra ingest** owns business events
* **BigQuery raw** is immutable
* **Derived logic** lives only in SQL
* **Checkout is not connected here**

---
