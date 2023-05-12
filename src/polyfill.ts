import "./internal/globalthis-eventtarget/index";
import { createServerAdapter } from "@whatwg-node/server";
import { createServer } from "node:http";
import type { Server } from "node:http";
import handleStaticFileFetch from "./internal/handleStaticFileFetch";
import handleFetch from "./handleFetch";
import FetchEvent from "./FetchEvent";
import type FetchEventInit from "./FetchEventInit";
import ExtendableEvent from "./ExtendableEvent";
import type ExtendableEventInit from "./ExtendableEventInit";
import defineEventHandlerIDLAttribute from "./REF-html-event-handlers/defineEventHandlerIDLAttribute";

type FetchEvent_ = FetchEvent;
type FetchEventT = typeof FetchEvent;
type FetchEventInit_ = FetchEventInit;
type ExtendableEvent_ = ExtendableEvent;
type ExtendableEventT = typeof ExtendableEvent;
type ExtendableEventInit_ = ExtendableEventInit;
declare global {
  type FetchEvent = FetchEvent_;
  var FetchEvent: FetchEventT;
  type FetchEventInit = FetchEventInit_;
  type ExtendableEvent = ExtendableEvent_;
  var ExtendableEvent: ExtendableEventT;
  type ExtendableEventInit = ExtendableEventInit_;
  var onfetch: EventListener | null;
}

globalThis.FetchEvent = FetchEvent;
globalThis.ExtendableEvent = ExtendableEvent;

defineEventHandlerIDLAttribute(globalThis, "onfetch");

let started = false;
let requestOrigins: Set<string>;
let server: Server | null | undefined;
function start() {
  const port = +process.env.PORT! || 8000;
  const hostname = process.env.HOSTNAME || "localhost";

  requestOrigins = new Set();
  server = createServer(
    createServerAdapter(async (request) => {
      request = new Request(request.url, request);
      // The http fetch invokes Handle Fetch with request. As a result of
      // performing Handle Fetch, the service worker returns a response to the
      // http fetch. The response, represented by a Response object, can be
      // retrieved from a Cache object or directly from network using
      // self.fetch(input, init) method. (A custom Response object can be
      // another option.)
      requestOrigins.add(new URL(request.url).origin);
      const possibleResponse = await handleFetch(request, undefined, true);
      return (
        possibleResponse ??
        (await handleStaticFileFetch(request)) ??
        new Response(null, { status: 404 })
      );
    })
  );
  server.listen({ host: hostname, port });
}

const globalThis_addEventListener_OLD = globalThis.addEventListener;
globalThis.addEventListener = function ($1, $2) {
  const returnValue = globalThis_addEventListener_OLD.call(this, ...arguments);

  const kEvents = Object.getOwnPropertySymbols(globalThis).find(
    (s) => s.description === "kEvents"
  )!;
  if (globalThis[kEvents].get("fetch")?.size >= 1) {
    if (!started) {
      started = true;
      start();
    }
  }

  return returnValue;
};

const fetch_OLD = fetch;
// @ts-ignore
fetch = function ($1) {
  if (started) {
    // @ts-ignore
    const request = new Request(...arguments);
    if (requestOrigins.has(new URL(request.url).origin)) {
      return handleStaticFileFetch(request);
    }
  }

  return fetch_OLD.call(this, ...arguments);
};
