import handleFetch from "../handleFetch";
import fallbackHandleRequest from "./fallbackHandleRequest";

const currentRequestURLs = new Set<string>();

async function handleRequest(request: Request): Promise<Response> {
  // This is for the specialFetch() function. It checks if the request is for
  // an origin that we control, and if so, to delegate directly to the
  // handleStaticFileFetch() function instead of going through the network.
  // Going through the network would cause an infinite loop!
  currentRequestURLs.add(request.url);
  try {
    // The http fetch invokes Handle Fetch with request. As a result of
    // performing Handle Fetch, the service worker returns a response to the
    // http fetch. The response, represented by a Response object, can be
    // retrieved from a Cache object or directly from network using
    // self.fetch(input, init) method. (A custom Response object can be
    // another option.)
    return (
      (await handleFetch(request, undefined, true)) ??
      (await fallbackHandleRequest(request))
    );
  } finally {
    currentRequestURLs.delete(request.url);
  }
}

export default handleRequest;
export { currentRequestURLs };
