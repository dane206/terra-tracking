// January 08, 2026
1️⃣ STOREFRONT (THEME) — ✅ DONE, 🧊 FROZEN
✅ 00-terra-gtm-transport.liquid
✅ 01-terra-identity-ssot.liquid
✅ 02-terra-item-utils.liquid
✅ 03-terra-view-item-producer.liquid
✅ 04-terra-add-to-cart-producer.liquid
✅ 05-terra-view-item-list-collection.liquid
✅ 06-terra-view-item-list-search.liquid



revised jan 10
```JS
/* =========================
   Terra Checkout Pixel v1
   ========================= */

const ENDPOINT = "https://pixel-ingest-dev-600339193870.us-central1.run.app/track";

function uuidv4() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === "x" ? r : (r & 3 | 8);
    return v.toString(16);
  });
}

function post(event_name, event) {
  try {
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        data_source: "shopify_checkout_pixel",
        event_name: event_name,
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        raw: event
      })
    });
  } catch (_) {}
}

/* =========================
   Checkout Funnel Events
   ========================= */

analytics.subscribe("checkout_started", function (event) {
  post("checkout_started", event);
});

analytics.subscribe("checkout_contact_info_submitted", function (event) {
  post("checkout_contact_info_submitted", event);
});

analytics.subscribe("checkout_address_info_submitted", function (event) {
  post("checkout_address_info_submitted", event);
});

analytics.subscribe("checkout_shipping_info_submitted", function (event) {
  post("checkout_shipping_info_submitted", event);
});

analytics.subscribe("payment_info_submitted", function (event) {
  post("payment_info_submitted", event);
});

analytics.subscribe("checkout_completed", function (event) {
  post("checkout_completed", event);
});
```


PIXEL

```JS
// Step 1. Initialize the JavaScript pixel SDK (make sure to exclude HTML)

console.log("[shopify_checkout_pixel] shopify_checkout_pixel", event?.data);

// Step 2. Subscribe to customer events with analytics.subscribe(), and add tracking
//  analytics.subscribe("all_standard_events", function (event) {
//    console.log("Event data ", event?.data);
//  });

analytics.subscribe("checkout_started", (event) => {
  console.log("[shopify_checkout_pixel] checkout_started");
  fetch("https://pixel-ingest-dev-600339193870.us-central1.run.app/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      data_source: "shopify_checkout_pixel",
      event_name: "checkout_started",
      event_id: crypto.randomUUID(),
      event_time: new Date().toISOString(),
      raw: event
    })
  });
});

analytics.subscribe("checkout_shipping_info_submitted", (event) => {
  console.log("[shopify_checkout_pixel] checkout_shipping_info_submitted");
  fetch("https://pixel-ingest-dev-600339193870.us-central1.run.app/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      data_source: "shopify_checkout_pixel",
      event_name: "checkout_shipping_info_submitted",
      event_id: crypto.randomUUID(),
      event_time: new Date().toISOString(),
      raw: event
    })
  });
});

analytics.subscribe("payment_info_submitted", (event) => {
  console.log("[shopify_checkout_pixel] payment_info_submitted");
  fetch("https://pixel-ingest-dev-600339193870.us-central1.run.app/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      data_source: "shopify_checkout_pixel",
      event_name: "payment_info_submitted",
      event_id: crypto.randomUUID(),
      event_time: new Date().toISOString(),
      raw: event
    })
  });
});

analytics.subscribe("checkout_completed", (event) => {
  console.log("[shopify_checkout_pixel] checkout_completed");
  fetch("https://pixel-ingest-dev-600339193870.us-central1.run.app/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      data_source: "shopify_checkout_pixel",
      event_name: "checkout_completed",
      event_id: crypto.randomUUID(),
      event_time: new Date().toISOString(),
      raw: event
    })
  });
});
```

## how schemas are created (the rule)

- create schemas top-down, one table at a time, and you never retroactively tighten RAW.
- RAW tables are created before ingestion; all other schemas are created after ingestion is proven.
- three layers, each with a different philosophy:
	- RAW      → permissive, immutable, strings
	- PARSED   → typed, validated, structured
	- DERIVED  → analytics-ready (items, sessions, revenue)

##	Final Emitted Contract (8-top-fields-2026; keep-1/1/26)
##	pixel-ingest-dev-7ak5xlux7q-uc.a.run.app/track

{
✅	"event_id": uuidv4(),
✅	"event_name": event.name,
✅	"payload": event.data || {},
✅	"session_key": null,
✅	"session_start": null,
✅	"source": "shopify_pixel",
✅	"th_vid": null,
✅	"timestamp": event.timestamp
}

##	Final Ingested Contract (9-top-fields-2026; keep-1/1/26)
##	terra-collector-dev-600339193870.us-central1.run.app/track

{
✅  "received_at": "2026-01-02T01:55:38.538Z", // timestamp of ingestion
✅  "event_id": "20515a21-fa05-4b55-ac0f-e91946077bb1", // collector ingests what producer emits
✅  "event_name": "page_viewed",
✅  "payload": {"ok":true},
✅  "session_key": "48369d16-c733-4c82-88bd-6102c3b59016",
✅  "session_start": "2026-01-02T01:34:08.443Z",
✅  "source": "shopify_pixel",
✅  "th_vid": "2b241962-a66f-4abb-a827-81d7af27d729",
✅  "timestamp": "2026-01-02T01:55:38.441Z"
}

##	Shared constants for pixel tracking
##	✅ 10 GA4 event names

export const EVENT_NAMES = {
  ADD_PAYMENT_INFO: 'add_payment_info',
  ADD_SHIPPING_INFO: 'add_shipping_info',
  ADD_TO_CART: 'add_to_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PAGE_VIEW: 'page_view',
  PURCHASE: 'purchase',
  SEARCH: 'search',
  VIEW_CART: 'view_cart',
  VIEW_ITEM: 'view_item',
  VIEW_ITEM_LIST: 'view_item_list',
};

##	Shared constants for pixel tracking
##	✅ 8 GA4 page_types

export const PAGE_TYPES = {
  CART: 'cart',
  COLLECTION: 'collection',
  HOME: 'home',
  PAGE: 'page',
  POST_PURCHASE: 'post_purchase',
  PRODUCT: 'product',
  SEARCH: 'search_results',
  THANK_YOU: 'thank_you',
};

##	Shared constants for pixel tracking
##	✅ 8 GA4 ecommerce events

export const ECOMMERCE_EVENTS = [
  EVENT_NAMES.ADD_PAYMENT_INFO,		--> currency, value, items
  EVENT_NAMES.ADD_SHIPPING_INFO, 	--> currency, value, items
  EVENT_NAMES.ADD_TO_CART, 			--> currency, value, items
  EVENT_NAMES.BEGIN_CHECKOUT,		--> currency, value, items
  EVENT_NAMES.PURCHASE,				--> currency, value, items
  EVENT_NAMES.VIEW_CART,  			--> currency, value, items
  EVENT_NAMES.VIEW_ITEM,			--> currency, value, items
  EVENT_NAMES.VIEW_ITEM_LIST		--> items
];

// note the ga4-event is called 'search' the automatic event is called 'view_search_results'

## 2026-01
terra-dev-plus-store events seen (qa by event name only):
1  * page_view
2  * add_to_cart
3  * view_item
4  * view_item_list
5  * scroll (auto-event)
6  * session_start (auto-event)
7  * user_engagement (auto-event)
8  * first_visit (auto-event)
9  * form_start (auto-event)
10 * form_submit
--
* active
** auto

export const DEFAULT_CURRENCY = 'USD';

## item mapping

var DIRECT_MAP = {
  item_id:        "id",
  item_name:      "nm",
  item_brand:     "br",
  item_category:  "ca",
  item_category2: "c2",
  item_category3: "c3",
  item_category4: "c4",
  item_category5: "c5",
  item_variant:   "va",
  price:          "pr",
  quantity:       "qt",
  coupon:         "cp",
  item_list_name: "ln",
  item_list_id:   "li",
  affiliation:    "af",
  promotion_id:   "pi",
  promotion_name: "pn",
  creative_name:  "cn",
  creative_slot:  "cs",
  location_id:    "lo"
};

## schemas

🧩 system_schema_metafields
received_at		received_at		TIMESTAMP	Use for ingestion audit
source			source			STRING		Deduplicate/merge
event_id		event_id		STRING		Use for deduplication logic
event_name		event			STRING		Use COALESCE(event)						
transaction_id	transaction_id	STRING	—				
order_id	order_id	STRING	—				
client_id	client_id	STRING	—				
session_id	session_key	STRING	Rename				
visitor_type	visitor_type	STRING	—				
terra_customer_id	terra_customer_id	STRING	—	

🛒 ecommerce_schema_metafields									
ecommerce		ecommerce 		(STRUCT or JSON)	STRUCT/JSON	Prefer structured — extract/parse if JSON				
ecommerce_items	ecommerce.items	ARRAY<STRUCT>		Flatten if needed				
data			payload			JSON				Evaluate — might overlap with ecommerce				
ctx				ctx				JSON				Optional — nested session context				

🌐 page_context_schema_metafields				
page_location	page_location	STRING	—				
page_referrer	page_referrer	STRING	—				
page_title		page_title		STRING	—				
page_type		page_type		STRING	—				
device_type		device_type		STRING	—								
iso_week		iso_week		STRING	—

🧭 attribution_utm_schema_metafields											
utm_source		utm_source, ft_source, lt_source	STRING	Choose priority order (e.g. first touch > last > raw)				
utm_medium		utm_medium, ft_medium, lt_medium	STRING	Same as above				
utm_campaign	utm_campaign, ft_camp, lt_camp		STRING	Same as above				
utm_content		utm_content							STRING	—				
utm_term		utm_term							STRING	—				
utm_id			utm_id								STRING	—				
fbclid			fbclid								STRING	Pick one				
gclid			gclid								STRING	Pick one				
gbraid			gbraid								STRING	—				
wbraid			wbraid								STRING	—				
ttclid			ttclid								STRING	—				
msclkid			msclkid								STRING	—				
pclid			pclid								STRING	—				
source			source								STRING	Choose one

## ask about:
// 	price_in_usd, item_revenue_in_usd, item_revenue, 
//	item_refund_usd, item_refund, item_list_index, 
ecommerce: total_item_quantity, total_item_quantity,purchase_revenue_in_usd
purchase_revenue
refund_value_in_usd
refund_value
shipping_value_in_usd
shipping_value
tax_value_in_usd
tax_value
unique_items
transaction_id

var ALIAS_MAP = {
  id:           "id",
  name:         "nm",
  brand:        "br",
  variant:      "va",
  list_name:    "ln",
  list_position:"lp",
  list:         "ln",
  position:     "lp",
  creative:     "cn"
};

var CATEGORY_KEYS = ["ca", "c2", "c3", "c4", "c5"];

/* ======================================================
   Utility: simple object iterator
====================================================== */
function forEach(obj, fn) {
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      fn(k, obj[k]);
    }
  }
}

## proven
✅ terra_identity_ready
✅ page_view
✅ view_item_list

## Not proven yet (no evidence run)
select_item
search

## Cart events:
add_to_cart
view_cart
remove_from_cart

## Checkout events:
begin_checkout
add_shipping_info
add_payment_info
purchase

## Explicit absence (by design) of:
terra_identity_ready
terra_user_authenticated

## terra-raw-web-pixel-870521678137.us-central1.run.app/track - kill

## gtm --> ga4 - leave alone for now
analytics.google.com/g/collect?v=2&tid=G-R5FWDRBNQS&gtm=45je5ca1v9222530690z89221579050za20gzb9221579050zd9221579050&
_p=1767318938419&_gaz=1&gcs=G1--&gcd=13l3l3R3l6l1&npa=0&dma=0&cid=283013740.1766532660&ecid=1578537224&ul=en-us&sr=1710x1112&
uaa=arm&uab=64&uafvl=Google%2520Chrome%3B143.0.7499.170%7CChromium%3B143.0.7499.170%7CNot%2520A(Brand%3B24.0.0.0&uamb=0&uam=&
uap=macOS&uapv=15.7.2&uaw=0&are=1&frm=0&pscdl=noapi&_eu=AAAAAAQ&_s=1&tag_exp=103116026~103200004~104527906~104528500~104684208~
104684211~105391253~115583767~115616986~115938465~115938468~116184927~116184929~116251938~116251940&
dl=https%3A%2F%2Fterra-dev-plus-store.myshopify.com%2F&dp=%2F&dt=terra-dev-plus-store&dr=&sid=1767317648&sct=22&seg=0&_tu=AAg&
en=terra_identity_ready&ep.event_id=2d49491e-7a88-4828-bc75-acc9f1685400&ep.timestamp=2026-01-02T01%3A55%3A38.419Z&
ep.ctx_id=397cf7f8-b915-4d72-9784-d2cff082155c&ep.ctx_version=1.0.5&ep.iso_week=2026_W01&ep.device_type=desktop&
ep.th_vid=2b241962-a66f-4abb-a827-81d7af27d729&ep.session_key=48369d16-c733-4c82-88bd-6102c3b59016&ep.session_start=2026-01-02T01%3A34%3A08.443Z&
ep.page_hostname=terra-dev-plus-store.myshopify.com&_et=2&up.th_vid=2b241962-a66f-4abb-a827-81d7af27d729&
up.session_key=48369d16-c733-4c82-88bd-6102c3b59016&up.session_start=2026-01-02T01%3A34%3A08.443Z&up.device_type=desktop&tfd=525

---

## ✅ terra_identity_ready
This is the most important event — and it is perfect.
Why:
th_vid ✅ present
session_key ✅ present
session_start ✅ present
ctx_version, ctx_id, iso_week, device_type ✅ present
Page context fully populated ✅
This proves:
Your identity bootstrap works
Cookies + sessionStorage are set before any meaningful tracking
There is no race condition here
This is your foundation. It’s solid.

{
    "event": "terra_identity_ready",
    "event_id": "b1697678-3c52-4c5d-b6ac-3f1d523b916d",
    "timestamp": "2026-01-06T05:14:20.839Z",
    "ctx_version": "1.0.7",
    "ctx_id": "acd28d15-ce5e-4d18-8091-7c99d6f38fdb",
    "iso_week": "2026_W02",
    "device_type": "desktop",
    "th_vid": "2b241962-a66f-4abb-a827-81d7af27d729",
    "session_key": "d53b19dd-c748-4c83-911f-90b1b78e9478",
    "session_start": "2026-01-05T22:37:45.748Z",
    "page_hostname": "terra-dev-plus-store.myshopify.com",
    "page_location": "https://terra-dev-plus-store.myshopify.com/collections/all",
    "page_path": "/collections/all",
    "page_title": "Products – terra-dev-plus-store",
    "page_referrer": "https://terra-dev-plus-store.myshopify.com/",
    "page_type": "collection",
    "gtm.uniqueEventId": 3
}

---

## ✅ page_view
This is correct and expected.
Key point:
It has the same 'ctx_id', 'th_vid', 'session_key' as identity
Timestamp is effectively identical (839 ms)
This is good:
Page view is a semantic analytics event
Identity is infrastructure
They should be separate.
✔ Keep both.

{
  "event": "page_view",
  "event_id": "1ff74a10-f58b-4f91-a24b-09b40d7427c6",
  "timestamp": "2026-01-06T05:14:20.839Z",
  "ctx_version": "1.0.7",
  "ctx_id": "acd28d15-ce5e-4d18-8091-7c99d6f38fdb",
  "iso_week": "2026_W02",
  "device_type": "desktop",
  "th_vid": "2b241962-a66f-4abb-a827-81d7af27d729",
  "session_key": "d53b19dd-c748-4c83-911f-90b1b78e9478",
  "session_start": "2026-01-05T22:37:45.748Z",
  "page_hostname": "terra-dev-plus-store.myshopify.com",
  "page_location": "https://terra-dev-plus-store.myshopify.com/collections/all",
  "page_path": "/collections/all",
  "page_title": "Products – terra-dev-plus-store",
  "page_referrer": "https://terra-dev-plus-store.myshopify.com/",
  "page_type": "collection",
  "gtm.uniqueEventId": 4
}

---

## ✅ view_item_list
This is excellent — and honestly very clean.
What’s right here:
Canonical item_id: shopify_US_<product>_<variant> ✅
item_group_id present ✅
item_list_id + item_list_name consistent ✅
index populated correctly (1..13) ✅
Categories normalized
No garbage fields
No missing price/currency
No duplicate items
This is GA4-grade ecommerce. Nothing to fix here.

{
    "event": "view_item_list",
    "event_id": "205ce9ee-039d-4937-81ef-bdca932816a7",
    "timestamp": "2026-01-06T05:14:20.840Z",
    "ctx_version": "1.0.7",
    "ctx_id": "acd28d15-ce5e-4d18-8091-7c99d6f38fdb",
    "iso_week": "2026_W02",
    "device_type": "desktop",
    "th_vid": "2b241962-a66f-4abb-a827-81d7af27d729",
    "session_key": "d53b19dd-c748-4c83-911f-90b1b78e9478",
    "session_start": "2026-01-05T22:37:45.748Z",
    "page_hostname": "terra-dev-plus-store.myshopify.com",
    "page_location": "https://terra-dev-plus-store.myshopify.com/collections/all",
    "page_path": "/collections/all",
    "page_title": "Products – terra-dev-plus-store",
    "page_referrer": "https://terra-dev-plus-store.myshopify.com/",
    "page_type": "collection",
    "ecommerce": {
        "currency": "USD",
        "value": 0,
        "item_list_id": "all",
        "item_list_name": "Products",
        "items": [
            {
                "item_id": "shopify_US_8514074378394_45808777691290",
                "item_group_id": "shopify_US_8514074378394",
                "product_id": 8514074378394,
                "variant_id": 45808777691290,
                "sku": "",
                "item_name": "Gift Card",
                "price": 10,
                "quantity": 1,
                "currency": "USD",
                "affiliation": "shopify_web_store",
                "item_brand": "Snowboard Vendor",
                "item_variant": "$10",
                "item_category": "giftcard",
                "item_category2": "",
                "item_category3": "",
                "item_category4": "",
                "item_category5": "",
                "item_list_id": "all",
                "item_list_name": "Products",
                "index": 1,
                "discount": 0,
                "coupon": "",
                "promotion_id": null,
                "promotion_name": null,
                "creative_name": null,
                "creative_slot": null,
                "location_id": ""
            }
        ]
    },
    "gtm.uniqueEventId": 5
}



{
  "event": "view_item",
  "event_id": "eff15773-b730-494f-8c40-468039fe7ebd",
  "timestamp": "2026-01-04T22:28:04.396Z",
  "ctx_version": "1.0.6",
  "ctx_id": "b2bf43ac-c65a-4252-b857-8b0eca286c43",
  "iso_week": "2026_W01",
  "device_type": "desktop",
  "th_vid": "2b241962-a66f-4abb-a827-81d7af27d729",
  "session_key": "7d00a6e6-e224-4e86-9517-f0d9d573e4e1",
  "session_start": "2026-01-04T22:28:04.395Z",
  "page_hostname": "terra-dev-plus-store.myshopify.com",
  "page_location": "https://terra-dev-plus-store.myshopify.com/products/the-collection-snowboard-oxygen",
  "page_path": "/products/the-collection-snowboard-oxygen",
  "page_title": "The Collection Snowboard: Oxygen – terra-dev-plus-store",
  "page_referrer": "https://terra-dev-plus-store.myshopify.com/",
  "ecommerce": {
    "currency": "USD",
    "value": 1025,
    "items": [
      {
        "item_id": "shopify_US_8514074771610_45808778379418",
        "item_group_id": "shopify_US_8514074771610",
        "product_id": 8514074771610,
        "variant_id": 45808778379418,
        "sku": "",
        "item_name": "The Collection Snowboard: Oxygen",
        "price": 1025,
        "quantity": 1,
        "currency": "USD",
        "affiliation": "shopify_web_store",
        "item_brand": "Hydrogen Vendor",
        "item_variant": "Default Title",
        "item_category": "snowboard",
        "item_category2": "",
        "item_category3": "",
        "item_category4": "",
        "item_category5": "",
        "item_list_id": "the-collection-snowboard-oxygen",
        "item_list_name": "The Collection Snowboard: Oxygen",
        "index": 1,
        "discount": 0,
        "coupon": "",
        "promotion_id": null,
        "promotion_name": null,
        "creative_name": null,
        "creative_slot": null,
        "location_id": ""
      }
    ]
  },
  "gtm.uniqueEventId": 4
}



google_analytics_events ->
-> stg_google_analytics_events
-> int_events_sessions_grouped
-> fct_sessions (3-way-split)
	(1) -> int_sessions_day_grouped -> fct_channel_performance
	(2) -> int_sessions_customer_grouped -> dim_customer
	(3) -> int_sessions_customer_map_grouped -> dim_customer_identity

dream metric

FAST SIGN-OFF STRATEGY (WHAT WE DO)
Goal: In one pass, answer for each event:
present in GA4
present in BQ
therefore: pipeline is working end-to-end (theme/pixel → collector → GA4)
We do counts + presence, not payload diffing yet.

You now compare:
GA4 event list
BQ event list

Outcomes:
Event in BQ + GA4 → ✔ flowing end-to-end
Event in BQ only → ✔ by design (e.g. terra_identity_ready)
Event in GA4 only → 🚨 bug
Event missing in both → not firing

| Layer    | `view_item` status  |
| -------- | ------------------- |
| Theme    | ❌ not proven       |
| GTM      | ❌ not proven       |
| GA4      | ✅ proven           |
| BigQuery | ❌ not proven       |

STEP 4 — QUICK EXPECTATION CHECK (NO ARGUMENTS)
Must appear in GA4

view_item
view_item_list
select_item
add_to_cart
remove_from_cart
view_cart
search
begin_checkout
add_shipping_info
add_payment_info
purchase

Must appear only in BQ
terra_identity_ready
terra_user_authenticated

If results match this → system-level sign-off achieved.

copy(JSON.stringify(
  dataLayer.filter(e => e && e.event === "terra_identity_ready").slice(-1)[0],
  null,
  2
));

copy(JSON.stringify(
  dataLayer.filter(e => e && e.event === "page_view").slice(-1)[0],
  null,
  2
));

copy(JSON.stringify(
  dataLayer.filter(e => e && e.event === "view_item").slice(-1)[0],
  null,
  2
));

copy(JSON.stringify(
  dataLayer.filter(e => e && e.event === "view_item_list").slice(-1)[0],
  null,
  2
));


