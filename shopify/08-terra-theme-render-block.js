{% render '01-terra-identity-ssot' %}
{% render '02-terra-user-identity' %}
{% render '03-terra-item-utils' %}

{% if request.page_type == 'product' %}
  {% render '04-terra-view-item-producer' %}
  {% render '05-terra-add-to-cart-producer' %}
{% endif %}

{% if request.page_type == 'collection' %}
  {% render '06-terra-view-item-list-collection' %}
{% endif %}

{% if request.page_type == 'search' %}
  {% render '07-terra-view-item-list-search' %}
{% endif %}

{% render '00-terra-gtm-transport' %}
