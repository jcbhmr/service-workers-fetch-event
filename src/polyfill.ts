import "./internal/globalthis-eventtarget/index.ts";
import { createServerAdapter } from "@whatwg-node/server";
import { createServer } from "node:http";
import handleStaticFileFetch from "./internal/handleStaticFileFetch";
import handleFetch from "./handleFetch";
import FetchEvent from "./FetchEvent";
import type FetchEventInit from "./FetchEventInit";
import ExtendableEvent from "./ExtendableEvent";
import type ExtendableEventInit from "./ExtendableEventInit";

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
  function addEventListener(
    type: "fetch",
    listener: (event: FetchEvent) => any,
    options?: EventListenerOptions
  ): void;
  function removeEventListener(
    type: "fetch",
    listener: (event: FetchEvent) => any,
    options?: EventListenerOptions
  );
}

globalThis.FetchEvent = FetchEvent;
globalThis.ExtendableEvent = ExtendableEvent;

// The http fetch invokes Handle Fetch with request. As a result of performing Handle Fetch, the service worker returns a response to the http fetch. The response, represented by a Response object, can be retrieved from a Cache object or directly from network using self.fetch(input, init) method. (A custom Response object can be another option.)
define(globalThis, "onfetch");

let started = false;
let requestOrigins: Set<string>;
let server: Server | null | undefined;
function start() {
  const port = +process.env.PORT || 8000;
  const hostname = process.env.HOSTNAME || "localhost";

  requestOrigins = new Set();
  server = createServer(
    createServerAdapter(async (request) => {
      requestOrigins.add(new URL(request.url).origin);
      const possibleResponse = await handleFetch(request, undefined, true);
      return possibleResponse ?? (await handleStaticFileFetch(request));
    })
  );
  server.listen({ host: hostname, port });
}
function stop() {
  server.close();
}

const globalThis_addEventListener_OLD = globalThis.addEventListener;
globalThis.addEventListener = function ($1, $2) {
  const returnValue = globalThis_addEventListener_OLD.call(this, ...arguments);

  const kEvents = Object.getOwnPropertySymbols(globalThis).find(
    (s) => s.description === "kEvents"
  );
  if (globalThis[kEvents].get("fetch")?.size >= 1) {
    if (!started) {
      started = true;
      start();
    }
  }

  return returnValue;
};

const globalThis_removeEventListener_OLD = globalThis.removeEventListener;
globalThis.removeEventListener = function ($1, $2) {
  const returnValue = globalThis_removeEventListener_OLD.call(
    this,
    ...arguments
  );

  const kEvents = Object.getOwnPropertySymbols(globalThis).find(
    (s) => s.description === "kEvents"
  );
  if (globalThis[kEvents].get("fetch")?.size === 0) {
    if (started) {
      started = false;
      stop();
    }
  }

  return returnValue;
};

const fetch_OLD = fetch;
fetch = function ($1) {
  if (started) {
    const request = new Request(...arguments);
    if (requestOrigins.has(new URL(request.url).origin)) {
      return handleStaticFileFetch(request);
    }
  }

  return fetch_OLD.call(this, ...arguments);
};
