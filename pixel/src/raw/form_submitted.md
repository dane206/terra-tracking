---
title: form_submitted
description: >-
  The `form_submitted` event logs an instance where a form on a page is
  submitted.
api_name: web-pixels
source_url:
  html: 'https://shopify.dev/docs/api/web-pixels-api/dom-events/form_submitted'
  md: 'https://shopify.dev/docs/api/web-pixels-api/dom-events/form_submitted.md'
---

# form\_​submitted

The `form_submitted` event logs an instance where a form on a page is submitted.

## Properties

* clientId

  string

  The client-side ID of the customer, provided by Shopify

* data

  PixelEventsFormSubmittedData

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

### PixelEventsFormSubmittedData

* element

  ```ts
  FormElement
  ```

```ts
export interface PixelEventsFormSubmittedData {
  element?: FormElement;
}
```

### FormElement

An object that contains data about a form element type

* action

  The action attribute of a form element

  ```ts
  string | null
  ```

* elements

  ```ts
  InputElement[]
  ```

* id

  The id attribute of an element

  ```ts
  string | null
  ```

```ts
export interface FormElement {
  /**
   * The action attribute of a form element
   */
  action?: string | null;
  elements?: InputElement[];

  /**
   * The id attribute of an element
   */
  id?: string | null;
}
```

### InputElement

An object that contains data about an input element type

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
export interface InputElement {
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
    analytics.subscribe('form_submitted', (event) => {
      // Example for accessing event data
      const element = event.data.element;

      const elementId = element.id;
      const formAction = element.action;
      const emailRegex = /email/i;
      const [email] = element.elements
        .filter((item) => emailRegex.test(item.id) || emailRegex.test(item.name))
        .map((item) => item.value);
      const formDetails = element.elements.map((item) => {
        return {
          id: item.id,
          name: item.name,
          value: item.value,
        };
      });

      const payload = {
        event_name: event.name,
        event_data: {
          id: elementId,
          url: formAction,
          email: email,
          formDetails: formDetails,
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
  analytics.subscribe('form_submitted', (event) => {
    // Example for accessing event data
    const element = event.data.element;

    const elementId = element.id;
    const formAction = element.action;
    const emailRegex = /email/i;
    const [email] = element.elements
      .filter((item) => emailRegex.test(item.id) || emailRegex.test(item.name))
      .map((item) => item.value);
    const formDetails = element.elements.map((item) => {
      return {
        id: item.id,
        name: item.name,
        value: item.value,
      };
    });

    const payload = {
      event_name: event.name,
      event_data: {
        id: elementId,
        url: formAction,
        email: email,
        formDetails: formDetails,
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