---
title: page_viewed
description: >-
  The `page_viewed` event logs an instance where a customer visited a page. This
  event is available on the online store, Checkout, **Order status** and
  Customer Account pages.


  > Note: Customer Accounts pages will only log the `page_viewed` event if a
  vanity domain is set up for the store.
api_name: web-pixels
source_url:
  html: 'https://shopify.dev/docs/api/web-pixels-api/standard-events/page_viewed'
  md: 'https://shopify.dev/docs/api/web-pixels-api/standard-events/page_viewed.md'
---

# page\_​viewed

The `page_viewed` event logs an instance where a customer visited a page. This event is available on the online store, Checkout, **Order status** and Customer Account pages.

Note

Customer Accounts pages will only log the `page_viewed` event if a vanity domain is set up for the store.

## Properties

* clientId

  string

  The client-side ID of the customer, provided by Shopify

* context

  Context

* data

  PixelEventsPageViewedData

  No additional data is provided by design. Use the event context to get the page metadata. E.g. `event.context.document.location.href`

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

  EventType.Standard

### Context

A snapshot of various read-only properties of the browser at the time of event

* document

  Snapshot of a subset of properties of the \`document\` object in the top frame of the browser

  ```ts
  WebPixelsDocument
  ```

* navigator

  Snapshot of a subset of properties of the \`navigator\` object in the top frame of the browser

  ```ts
  WebPixelsNavigator
  ```

* window

  Snapshot of a subset of properties of the \`window\` object in the top frame of the browser

  ```ts
  WebPixelsWindow
  ```

```ts
export interface Context {
  /**
   * Snapshot of a subset of properties of the `document` object in the top
   * frame of the browser
   */
  document?: WebPixelsDocument;

  /**
   * Snapshot of a subset of properties of the `navigator` object in the top
   * frame of the browser
   */
  navigator?: WebPixelsNavigator;

  /**
   * Snapshot of a subset of properties of the `window` object in the top frame
   * of the browser
   */
  window?: WebPixelsWindow;
}
```

### WebPixelsDocument

A snapshot of a subset of properties of the \`document\` object in the top frame of the browser

* characterSet

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Document), returns the character set being used by the document

  ```ts
  string
  ```

* location

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Document), returns the URI of the current document

  ```ts
  Location
  ```

* referrer

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Document), returns the URI of the page that linked to this page

  ```ts
  string
  ```

* title

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Document), returns the title of the current document

  ```ts
  string
  ```

```ts
export interface WebPixelsDocument {
  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document),
   * returns the character set being used by the document
   */
  characterSet?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document),
   * returns the URI of the current document
   */
  location?: Location;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document),
   * returns the URI of the page that linked to this page
   */
  referrer?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document),
   * returns the title of the current document
   */
  title?: string;
}
```

### Location

A snapshot of a subset of properties of the \`location\` object in the top frame of the browser

* hash

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Location), a string containing a \`'#'\` followed by the fragment identifier of the URL

  ```ts
  string
  ```

* host

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Location), a string containing the host, that is the hostname, a \`':'\`, and the port of the URL

  ```ts
  string
  ```

* hostname

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Location), a string containing the domain of the URL

  ```ts
  string
  ```

* href

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Location), a string containing the entire URL

  ```ts
  string
  ```

* origin

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Location), a string containing the canonical form of the origin of the specific location

  ```ts
  string
  ```

* pathname

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Location), a string containing an initial \`'/'\` followed by the path of the URL, not including the query string or fragment

  ```ts
  string
  ```

* port

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Location), a string containing the port number of the URL

  ```ts
  string
  ```

* protocol

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Location), a string containing the protocol scheme of the URL, including the final \`':'\`

  ```ts
  string
  ```

* search

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Location), a string containing a \`'?'\` followed by the parameters or "querystring" of the URL

  ```ts
  string
  ```

```ts
export interface Location {
  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location), a
   * string containing a `'#'` followed by the fragment identifier of the URL
   */
  hash?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location), a
   * string containing the host, that is the hostname, a `':'`, and the port of
   * the URL
   */
  host?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location), a
   * string containing the domain of the URL
   */
  hostname?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location), a
   * string containing the entire URL
   */
  href?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location), a
   * string containing the canonical form of the origin of the specific location
   */
  origin?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location), a
   * string containing an initial `'/'` followed by the path of the URL, not
   * including the query string or fragment
   */
  pathname?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location), a
   * string containing the port number of the URL
   */
  port?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location), a
   * string containing the protocol scheme of the URL, including the final `':'`
   */
  protocol?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location), a
   * string containing a `'?'` followed by the parameters or "querystring" of
   * the URL
   */
  search?: string;
}
```

### WebPixelsNavigator

A snapshot of a subset of properties of the \`navigator\` object in the top frame of the browser

* cookieEnabled

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Navigator), returns \`false\` if setting a cookie will be ignored and true otherwise

  ```ts
  boolean
  ```

* language

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Navigator), returns a string representing the preferred language of the user, usually the language of the browser UI. The \`null\` value is returned when this is unknown

  ```ts
  string
  ```

* languages

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Navigator), returns an array of strings representing the languages known to the user, by order of preference

  ```ts
  ReadonlyArray<string>
  ```

* userAgent

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Navigator), returns the user agent string for the current browser

  ```ts
  string
  ```

```ts
export interface WebPixelsNavigator {
  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator),
   * returns `false` if setting a cookie will be ignored and true otherwise
   */
  cookieEnabled?: boolean;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator),
   * returns a string representing the preferred language of the user, usually
   * the language of the browser UI. The `null` value is returned when this
   * is unknown
   */
  language?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator),
   * returns an array of strings representing the languages known to the user,
   * by order of preference
   */
  languages?: ReadonlyArray<string>;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator),
   * returns the user agent string for the current browser
   */
  userAgent?: string;
}
```

### WebPixelsWindow

A snapshot of a subset of properties of the \`window\` object in the top frame of the browser

* innerHeight

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), gets the height of the content area of the browser window including, if rendered, the horizontal scrollbar

  ```ts
  number
  ```

* innerWidth

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), gets the width of the content area of the browser window including, if rendered, the vertical scrollbar

  ```ts
  number
  ```

* location

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), the location, or current URL, of the window object

  ```ts
  Location
  ```

* origin

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), the global object's origin, serialized as a string

  ```ts
  string
  ```

* outerHeight

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), gets the height of the outside of the browser window

  ```ts
  number
  ```

* outerWidth

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), gets the width of the outside of the browser window

  ```ts
  number
  ```

* pageXOffset

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), an alias for window\.scrollX

  ```ts
  number
  ```

* pageYOffset

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), an alias for window\.scrollY

  ```ts
  number
  ```

* screen

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Screen), the interface representing a screen, usually the one on which the current window is being rendered

  ```ts
  Screen
  ```

* screenX

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), the horizontal distance from the left border of the user's browser viewport to the left side of the screen

  ```ts
  number
  ```

* screenY

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), the vertical distance from the top border of the user's browser viewport to the top side of the screen

  ```ts
  number
  ```

* scrollX

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), the number of pixels that the document has already been scrolled horizontally

  ```ts
  number
  ```

* scrollY

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Window), the number of pixels that the document has already been scrolled vertically

  ```ts
  number
  ```

```ts
export interface WebPixelsWindow {
  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window),
   * gets the height of the content area of the browser window including, if
   * rendered, the horizontal scrollbar
   */
  innerHeight?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), gets
   * the width of the content area of the browser window including, if rendered,
   * the vertical scrollbar
   */
  innerWidth?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), the
   * location, or current URL, of the window object
   */
  location?: Location;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), the
   * global object's origin, serialized as a string
   */
  origin?: string;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), gets
   * the height of the outside of the browser window
   */
  outerHeight?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), gets
   * the width of the outside of the browser window
   */
  outerWidth?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), an
   * alias for window.scrollX
   */
  pageXOffset?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), an
   * alias for window.scrollY
   */
  pageYOffset?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Screen), the
   * interface representing a screen, usually the one on which the current
   * window is being rendered
   */
  screen?: Screen;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), the
   * horizontal distance from the left border of the user's browser viewport to
   * the left side of the screen
   */
  screenX?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), the
   * vertical distance from the top border of the user's browser viewport to the
   * top side of the screen
   */
  screenY?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), the
   * number of pixels that the document has already been scrolled horizontally
   */
  scrollX?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window), the
   * number of pixels that the document has already been scrolled vertically
   */
  scrollY?: number;
}
```

### Screen

The interface representing a screen, usually the one on which the current window is being rendered

* height

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Screen/height), the height of the screen

  ```ts
  number
  ```

* width

  Per \[MDN]\(https://developer.mozilla.org/en-US/docs/Web/API/Screen/width), the width of the screen

  ```ts
  number
  ```

```ts
export interface Screen {
  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Screen/height),
   * the height of the screen
   */
  height?: number;

  /**
   * Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Screen/width),
   * the width of the screen
   */
  width?: number;
}
```

### PixelEventsPageViewedData

No additional data is provided by design. Use the event context to get the page metadata. E.g. \`event.context.document.location.href\`



```ts
export interface PixelEventsPageViewedData {}
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

* #### Accessing Standard Events

  ##### App Pixel

  ```javascript
  import {register} from '@shopify/web-pixels-extension';

  register(({analytics}) => {
    analytics.subscribe('page_viewed', (event) => {
      // Example for accessing event data
      const timeStamp = event.timestamp;

      const pageEventId = event.id;

      const payload = {
        event_name: event.name,
        event_data: {
          pageEventId: pageEventId,
          timeStamp: timeStamp,
        },
      };

      // Example for sending event data to third party servers
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
  analytics.subscribe('page_viewed', (event) => {
    // Example for accessing event data
    const timeStamp = event.timestamp;

    const pageEventId = event.id;

    const payload = {
      event_name: event.name,
      event_data: {
        pageEventId: pageEventId,
        timeStamp: timeStamp,
      },
    };

    // Example for sending event data to third party servers
    fetch('https://example.com/pixel', {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true,
    });
  });
  ```