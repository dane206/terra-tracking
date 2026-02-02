Understood. No wildcards. No grouping. No shorthand.
This is the **fully explicit, reality-aligned, authoritative map** of your Terra system.

This is what goes into `01-TERRA-CODE-MAP.md`.

---

# Terra Code Map — Explicit Ownership of Every Variable

> If any variable below is written outside the file listed, it is a bug.

---

## `00-terra-gtm-loader.liquid`

| Purpose          | Loads Terra snippets in correct order on every page |
| ---------------- | --------------------------------------------------- |
| Writes variables | None                                                |

---

## `01-terra-attribution-ready.liquid`

| Variable            | Purpose               |
| ------------------- | --------------------- |
| `terra_ft_source`   | First-touch source    |
| `terra_ft_medium`   | First-touch medium    |
| `terra_ft_campaign` | First-touch campaign  |
| `terra_ft_content`  | First-touch creative  |
| `terra_ft_term`     | First-touch term      |
| `terra_ft_id`       | First-touch id        |
| `terra_lt_source`   | Last-touch source     |
| `terra_lt_medium`   | Last-touch medium     |
| `terra_lt_campaign` | Last-touch campaign   |
| `terra_lt_content`  | Last-touch creative   |
| `terra_lt_term`     | Last-touch term       |
| `terra_lt_id`       | Last-touch id         |
| `terra_gclid`       | Google click id       |
| `terra_gbraid`      | Google braided id     |
| `terra_wbraid`      | Google web braided id |
| `terra_msclkid`     | Microsoft click id    |
| `terra_fbclid`      | Meta click id         |
| `terra_ttclid`      | TikTok click id       |

---

## `02-terra-identity-ssot.liquid`

| Variable        | Purpose               |
| --------------- | --------------------- |
| `th_vid`        | Visitor id            |
| `session_key`   | Session id            |
| `session_start` | Session start time    |
| `terra_ga_cid`  | GA4 client id         |
| `terra_ga_sid`  | GA4 session id        |
| `terra_ga_sn`   | GA4 session number    |
| `event_id`      | UUID for event        |
| `timestamp`     | ISO timestamp         |
| `iso_week`      | ISO week              |
| `page_hostname` | Hostname              |
| `page_location` | Full URL              |
| `page_path`     | Path                  |
| `page_title`    | Title                 |
| `page_referrer` | Referrer              |
| `page_type`     | Shopify page type     |
| `ctx_id`        | Context id            |
| `ctx_version`   | Context version       |
| `device_type`   | Device type           |
| `terra_ctx`     | Shared context object |

---

## `03-terra-item-utils.liquid` (inside `terraBuildCanonicalItem()`)

| Variable         | Purpose            |
| ---------------- | ------------------ |
| `item_id`        | Canonical item id  |
| `item_group_id`  | Canonical group id |
| `variant_id`     | Variant id         |
| `sku`            | SKU                |
| `item_name`      | Product name       |
| `item_brand`     | Brand              |
| `item_category`  | Category level 1   |
| `item_category2` | Category level 2   |
| `item_category3` | Category level 3   |
| `item_category4` | Category level 4   |
| `item_category5` | Category level 5   |
| `item_variant`   | Variant name       |
| `price`          | Price              |
| `quantity`       | Quantity           |
| `discount`       | Discount           |
| `coupon`         | Coupon             |
| `index`          | Position index     |
| `item_list_id`   | List id            |
| `item_list_name` | List name          |
| `location_id`    | Location id        |
| `creative_name`  | Creative name      |
| `creative_slot`  | Creative slot      |
| `promotion_id`   | Promotion id       |
| `promotion_name` | Promotion name     |

---

## `04-terra-checkout-bridge.liquid`

| Purpose          | Writes Terra data into Shopify order attributes during checkout |
| ---------------- | --------------------------------------------------------------- |
| Writes variables | None new — copies existing Terra values                         |

---

## `05-terra-view-item-producer.liquid`

| Purpose           | Emits `view_item` event                 |
| ----------------- | --------------------------------------- |
| Creates variables | None — calls identity, page, item utils |

---

## `06-terra-add-to-cart-producer.liquid`

| Purpose           | Emits `add_to_cart` event               |
| ----------------- | --------------------------------------- |
| Creates variables | None — calls identity, page, item utils |

---

## `07-terra-view-item-list-collection.liquid`

| Purpose           | Emits `view_item_list` from collections   |
| ----------------- | ----------------------------------------- |
| Creates variables | None — calls item utils with list context |

---

## `08-terra-view-item-list-search.liquid`

| Purpose           | Emits `view_item_list` from search        |
| ----------------- | ----------------------------------------- |
| Creates variables | None — calls item utils with list context |

---

## `card-product.liquid`

| Variable                 | Purpose                                |
| ------------------------ | -------------------------------------- |
| `item_list_id`           | Passed via click context               |
| `item_list_name`         | Passed via click context               |
| `select_promotion` event | Creates `ctx.promotion` for item utils |

---

This is now a **complete, explicit, file-accurate ownership map** of every Terra variable.
