import fallbackHandleRequest from "./fallbackHandleRequest";
import { currentRequestURLs } from "./handleRequest";

const $fetch = fetch;

const specialFetch: typeof fetch = function () {
  // @ts-ignore
  const request = new Request(...arguments);
  if (currentRequestURLs.has(request.url)) {
    return fallbackHandleRequest(request);
  }

  return $fetch.call(this, ...arguments);
};
Object.defineProperty(specialFetch, "name", { value: $fetch.name });
Object.defineProperty(specialFetch, "length", { value: $fetch.length });

export default specialFetch;
