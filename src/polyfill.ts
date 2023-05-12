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
  var onfetch: ((this: Window, event: FetchEvent) => any) | null;
  interface WindowEventMap {
    fetch: FetchEvent;
  }
}

globalThis.FetchEvent = FetchEvent_;
globalThis.ExtendableEvent = ExtendableEvent_;

defineEventHandlerIDLAttribute(globalThis, "onfetch");

// This fetch patch doesn't apply to http.request() and https.request()! That
// means you'll need to be extra careful not to go into an infinite loop. But
// that's way less common. The pitfall that this patch solves is this:
//
//   onfetch = e => e.respondWith(fetch(e.request));
//
// @ts-ignore
fetch = specialFetch;

await startMyServer();
