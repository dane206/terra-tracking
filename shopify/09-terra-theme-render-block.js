{% render '00-terra-gtm-transport' %}

{% render '01-terra-attribution-bootstrap' %}   <!-- URL → cookies -->
{% render '02-terra-identity-ssot' %}           <!-- cookies → ctx -->
{% render '03-terra-item-utils' %}              <!-- canonical item builder -->
{% render '04-terra-checkout-bridge' %}         <!-- ctx → cart.attributes -->

{% if request.page_type == 'product' %}
  {% render '05-terra-view-item-producer' %}
  {% render '06-terra-add-to-cart-producer' %}
{% endif %}

{% if request.page_type == 'collection' %}
  {% render '07-terra-view-item-list-collection' %}
{% endif %}

{% if request.page_type == 'search' %}
  {% render '08-terra-view-item-list-search' %}
{% endif %}
