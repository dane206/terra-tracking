# GTM Triggers (Storefront)

All triggers are **Custom Event** triggers.  
No DOM Ready. No Page View triggers. No conditions beyond event name.

---

## Trigger List

| Trigger Name        | Event Name        |
|---------------------|-------------------|
| init_all_pages      | gtm.js            |
| ev_terra_identity   | terra_identity    |
| ev_page_view        | page_view         |
| ev_view_item_list   | view_item_list    |
| ev_view_item        | view_item         |
| ev_add_to_cart      | add_to_cart       |
| ev_view_promotion   | view_promotion    |

---

## Rules

- Triggers listen **only** to explicit `dataLayer.push()` events emitted by the theme
- GTM never re-emits events
- GTM never infers state, page context, or ecommerce data
- No trigger uses DOM state, URL matching, or history listeners

This trigger set is **locked** unless the dataLayer contract changes.
