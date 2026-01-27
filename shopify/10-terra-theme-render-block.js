{% render '00-terra-datalayer-api' %}

{% render '01-terra-attribution-bootstrap' %}
{% render '02-terra-identity-ssot' %}
{% render '03-terra-item-utils' %}
{% render '04-terra-checkout-bridge' %}

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

{% render '99-terra-gtm-loader' %}
