<script id="terra-item-utils">
(function () {
  // Guard against double-load
  if (window.terraBuildCanonicalItem) return;

  /* =========================
     CONFIG DEFAULTS
  ========================= */
  var DEFAULT_BRAND = "Terra Health Essentials";
  var DEFAULT_AFFILIATION = "shopify_web_store";
  var DEFAULT_CURRENCY = "USD";

  /* =========================
     Helpers
  ========================= */

  function isFiniteNumber(x) {
    return typeof x === "number" && isFinite(x);
  }

  function toNumber(x) {
    if (isFiniteNumber(x)) return x;
    if (typeof x === "string") {
      var s = x.trim();
      if (s !== "" && isFinite(Number(s))) return Number(s);
    }
    return null;
  }

  function toDigitsString(x) {
    return String(x == null ? "" : x).replace(/\D/g, "");
  }

  function isNonEmptyString(x) {
    return typeof x === "string" && x.trim().length > 0;
  }

  function buildItemId(productIdDigits, variantIdDigits) {
    return "shopify_US_" + productIdDigits + "_" + variantIdDigits;
  }

  function buildItemGroupId(productIdDigits) {
    return "shopify_US_" + productIdDigits;
  }

  function safeString(x) {
    return x == null ? "" : String(x);
  }

  function safeNullable(x) {
    return x == null ? null : x;
  }

  function toIntOrNull(x) {
    var n = toNumber(x);
    if (n == null) return null;
    n = Math.floor(n);
    return isFinite(n) ? n : null;
  }

  /* =========================
     Canonical Item Builder
     - outputs full canonical schema + your required internal ids
  ========================= */

  function buildCanonicalItem(input) {
    input = input || {};

    var productIdDigits = toDigitsString(input.product_id);
    var variantIdDigits = toDigitsString(input.variant_id);

    // Hard stop: don't build invalid IDs
    if (!productIdDigits || !variantIdDigits) return null;

    var price = toNumber(input.price);
    var qty = toIntOrNull(input.quantity);

    if (price == null) return null;
    if (qty == null || qty < 1) return null;

    var currency = safeString(input.currency || DEFAULT_CURRENCY);
    var affiliation = safeString(input.affiliation || DEFAULT_AFFILIATION);
    var brand = safeString(input.item_brand || DEFAULT_BRAND);

    // index/discount should exist even if 0
    var index = toIntOrNull(input.index);
    if (index == null) index = 0;

    var discount = toNumber(input.discount);
    if (discount == null) discount = 0;

    return {
      /* REQUIRED GA4 IDS */
      item_id: buildItemId(productIdDigits, variantIdDigits),
      item_group_id: buildItemGroupId(productIdDigits),

      /* YOUR REQUIRED INTERNAL IDS (keep these) */
      variant_id: variantIdDigits,
      sku: safeString(input.sku),

      /* REQUIRED FIELDS */
      item_name: safeString(input.item_name),
      affiliation: affiliation,
      currency: currency,
      price: price,
      quantity: qty,

      /* REQUIRED/EXPECTED CANONICAL FIELDS (always present) */
      coupon: safeString(input.coupon),
      discount: discount,
      index: index,

      item_brand: brand,

      item_category: safeString(input.item_category),
      item_category2: safeString(input.item_category2),
      item_category3: safeString(input.item_category3),
      item_category4: safeString(input.item_category4),
      item_category5: safeString(input.item_category5),

      item_list_id: safeString(input.item_list_id),
      item_list_name: safeString(input.item_list_name),

      item_variant: safeString(input.item_variant),
      location_id: safeString(input.location_id),

      creative_name: safeNullable(input.creative_name),
      creative_slot: safeNullable(input.creative_slot),

      promotion_id: safeNullable(input.promotion_id),
      promotion_name: safeNullable(input.promotion_name)
    };
  }

  /* =========================
     Canonical Item Validator
  ========================= */

  function validateCanonicalItem(item) {
    var errors = [];
    item = item || {};

    if (!isNonEmptyString(item.item_id)) errors.push("item_id_missing");
    if (!/^shopify_US_\d+_\d+$/.test(item.item_id || "")) errors.push("item_id_bad_format");

    if (!isNonEmptyString(item.item_group_id)) errors.push("item_group_id_missing");
    if (!/^shopify_US_\d+$/.test(item.item_group_id || "")) errors.push("item_group_id_bad_format");

    if (!isNonEmptyString(item.item_name)) errors.push("item_name_missing");

    if (!isFiniteNumber(item.price)) errors.push("price_not_number");
    if (!(typeof item.quantity === "number" && isFinite(item.quantity) && item.quantity >= 1 && Math.floor(item.quantity) === item.quantity)) {
      errors.push("quantity_not_int_ge_1");
    }

    return { ok: errors.length === 0, errors: errors };
  }

  /* =========================
     Public API
  ========================= */

  window.terraBuildCanonicalItem = buildCanonicalItem;
  window.terraValidateCanonicalItem = validateCanonicalItem;

})();
</script>
