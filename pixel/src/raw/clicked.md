---
title: clicked
description: >-
  The `clicked` event logs an instance where a customer clicks on a page
  element.
api_name: web-pixels
source_url:
  html: 'https://shopify.dev/docs/api/web-pixels-api/dom-events/clicked'
  md: 'https://shopify.dev/docs/api/web-pixels-api/dom-events/clicked.md'
---

# clicked

The `clicked` event logs an instance where a customer clicks on a page element.

## Properties

* clientId

  string

  The client-side ID of the customer, provided by Shopify

* data

  MouseEventData

* id

  string

  The ID of the customer event

* name

  string

  The name of the customer event

* seq

  number

  The sequence index number of the event.

* timestamp

  string

  The timestamp of when the customer event occurred, in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format

* type

  EventType.Dom

### MouseEventData

An object that contains data about a mouse event

* clientX

  ```ts
  number
  ```

* clientY

  ```ts
  number
  ```

* element

  ```ts
  GenericElement
  ```

* movementX

  ```ts
  number
  ```

* movementY

  ```ts
  number
  ```

* offsetX

  ```ts
  number
  ```

* offsetY

  ```ts
  number
  ```

* pageX

  ```ts
  number
  ```

* pageY

  ```ts
  number
  ```

* screenX

  ```ts
  number
  ```

* screenY

  ```ts
  number
  ```

```ts
export interface MouseEventData {
  clientX?: number;
  clientY?: number;
  element?: GenericElement;
  movementX?: number;
  movementY?: number;
  offsetX?: number;
  offsetY?: number;
  pageX?: number;
  pageY?: number;
  screenX?: number;
  screenY?: number;
}
```

### GenericElement

An object that contains data about a generic element type

* href

  The href attribute of an element

  ```ts
  string | null
  ```

* id

  The id attribute of an element

  ```ts
  string | null
  ```

* name

  The name attribute of an element

  ```ts
  string | null
  ```

* tagName

  A string representation of the tag of an element

  ```ts
  string | null
  ```

* type

  The type attribute of an element. Often relevant for an input or button element.

  ```ts
  string | null
  ```

* value

  The value attribute of an element. Often relevant for an input element.

  ```ts
  string | null
  ```

```ts
export interface GenericElement {
  /**
   * The href attribute of an element
   */
  href?: string | null;

  /**
   * The id attribute of an element
   */
  id?: string | null;

  /**
   * The name attribute of an element
   */
  name?: string | null;

  /**
   * A string representation of the tag of an element
   */
  tagName?: string | null;

  /**
   * The type attribute of an element. Often relevant for an input or button
   * element.
   */
  type?: string | null;

  /**
   * The value attribute of an element. Often relevant for an input element.
   */
  value?: string | null;
}
```

### EventType

* AdvancedDom

  ```ts
  advanced-dom
  ```

* Custom

  ```ts
  custom
  ```

* Dom

  ```ts
  dom
  ```

* Meta

  ```ts
  meta
  ```

* Standard

  ```ts
  standard
  ```

```ts
export enum EventType {
  AdvancedDom = 'advanced-dom',
  Custom = 'custom',
  Dom = 'dom',
  Meta = 'meta',
  Standard = 'standard',
}
```

Examples

### Examples

* #### Accessing DOM Events

  ##### App Pixel

  ```javascript
  import {register} from '@shopify/web-pixels-extension';

  register(({analytics}) => {
    analytics.subscribe('clicked', (event) => {
      // Example for accessing event data
      const element = event.data.element;

      const elementId = element.id;
      const elementValue = element.value;
      const elementHref = element.href;

      const payload = {
        event_name: event.name,
        event_data: {
          id: elementId,
          value: elementValue,
          url: elementHref,
        },
      };

      // Example for sending event to third party servers
      fetch('https://example.com/pixel', {
        method: 'POST',
        body: JSON.stringify(payload),
        keepalive: true,
      });
    });
  });
  ```

  ##### Custom Pixel

  ```javascript
  analytics.subscribe('clicked', (event) => {
    // Example for accessing event data
    const element = event.data.element;

    const elementId = element.id;
    const elementValue = element.value;
    const elementHref = element.href;

    const payload = {
      event_name: event.name,
      event_data: {
        id: elementId,
        value: elementValue,
        url: elementHref,
      },
    };

    // Example for sending event to third party servers
    fetch('https://example.com/pixel', {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true,
    });
  });
  ```