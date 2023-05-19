import "./internal/globalthis-eventtarget/index";
import FetchEvent_ from "./FetchEvent";
import type FetchEventInit_ from "./FetchEventInit";
import ExtendableEvent_ from "./ExtendableEvent";
import type ExtendableEventInit_ from "./ExtendableEventInit";
import defineEventHandlerIDLAttribute from "./REF-html-event-handlers/defineEventHandlerIDLAttribute";
import specialFetch from "./internal/specialFetch";
import startMyServer from "./internal/startMyServer";

declare global {
  type FetchEvent = FetchEvent_;
  var FetchEvent: typeof FetchEvent_;
  type FetchEventInit = FetchEventInit_;
  type ExtendableEvent = ExtendableEvent_;
  var ExtendableEvent: typeof ExtendableEvent_;
  type ExtendableEventInit = ExtendableEventInit_;

  /** @see https://w3c.github.io/ServiceWorker/#dom-serviceworkerglobalscope-onfetch */
  var onfetch: ((this: Window, event: FetchEvent) => any) | null;

  interface WindowEventMap {
    /**
     * @see https://w3c.github.io/ServiceWorker/#service-worker-global-scope-fetch-event
     * @see https://w3c.github.io/ServiceWorker/#fetchevent
     */
    fetch: FetchEvent;
  }
}

globalThis.FetchEvent = FetchEvent_;
globalThis.ExtendableEvent = ExtendableEvent_;

defineEventHandlerIDLAttribute(globalThis, "onfetch");

// Make 'e.respondWith(fetch(e.request))' work without an infinite loop. This
// is also used as the fallback for 'e.respondWith()' when the event handler
// does not call 'e.respondWith()'.
// @ts-ignore
fetch = specialFetch;

/**
 * The http fetch invokes Handle Fetch with request. As a result of performing
 * Handle Fetch, the service worker returns a response to the http fetch. The
 * response, represented by a Response object, can be retrieved from a Cache
 * object or directly from network using `self.fetch(input, init)` method. (A
 * custom `Response` object can be another option.)
 *
 * This is all handled internally in an implementation-defined manner. We use
 * Node.js's built-in HTTP server to handle the HTTP requests and pass them to
 * the `handleFetch()` function.
 *
 * @see https://w3c.github.io/ServiceWorker/#service-worker-global-scope-fetch-event
 */
await startMyServer();
