const measurementId = `G-XXXXXXXXXX`;
const apiSecret = `<secret_value>`;

fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
  method: "POST",
  body: JSON.stringify({
    "client_id": "client_id",
    "events": [{
      "name": "select_promotion",
      "params": {
        "creative_name": "Summer Banner",
        "creative_slot": "featured_app_1",
        "promotion_id": "P_12345",
        "promotion_name": "Summer Sale",
        "items": [
          {
            "item_id": "SKU_12345",
            "item_name": "Stan and Friends Tee",
            "affiliation": "Google Merchandise Store",
            "coupon": "SUMMER_FUN",
            "creative_name": "summer_banner2",
            "creative_slot": "featured_app_1",
            "currency": "USD",
            "discount": 2.22,
            "index": 0,
            "item_brand": "Google",
            "item_category": "Apparel",
            "item_category2": "Adult",
            "item_category3": "Shirts",
            "item_category4": "Crew",
            "item_category5": "Short sleeve",
            "item_list_id": "related_products",
            "item_list_name": "Related Products",
            "item_variant": "green",
            "location_id": "ChIJIQBpAG2ahYAR_6128GcTUEo",
            "price": 10.01,
            "promotion_id": "P_12345",
            "promotion_name": "Summer Sale",
            "google_business_vertical": "retail",
            "quantity": 3
          }
        ]
      }
    }]
  })
});