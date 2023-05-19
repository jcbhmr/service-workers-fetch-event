import FetchEvent, {
  potentialResponse,
  respondWithEnteredFlag,
  respondWithErrorFlag,
  waitToRespondFlag,
} from "./FetchEvent";

/** @see https://w3c.github.io/ServiceWorker/#handle-fetch */
async function handleFetch(
  request: Request,
  controller: any,
  useHighResPerformanceTimers: boolean
): Promise<Response | null> {
  const timingInfo = {} as any;
  timingInfo.startTime = performance.now();

  // Set eventHandled to a new promise in workerRealm.
  const eventHandled = pDefer()

  // Queue a task task to run the following substeps:
  const task = (async () => {
    // Let e be the result of creating an event with FetchEvent.
    // Let requestObject be the result of creating a Request object, given request, a new Headers object’s guard which is "immutable", and workerRealm.
    // Initialize e’s type attribute to fetch.
    // Initialize e’s cancelable attribute to true.
    // Initialize e’s request attribute to requestObject.
    // Initialize e’s handled to eventHandled.
    const e = new FetchEvent("fetch", {
      cancelable: true,
      request: request,
      handled: eventHandled,
    });

    // Let timingInfo’s fetch event dispatch time to the coarsened shared current time given useHighResPerformanceTimers.
    timingInfo.fetchEventDispatchTime = performance.now();

    // Dispatch e at activeWorker’s global object.
    globalThis.dispatchEvent(e);

    // If e’s respond-with entered flag is set, set respondWithEntered to true.
    if (respondWithEnteredFlag.get(e)) {
      respondWithEntered = true;
    }

    // If e’s wait to respond flag is set, then:
    if (waitToRespondFlag.get(e)) {
      // Wait until e’s wait to respond flag is unset.
      await waitUntil(() => !waitToRespondFlag.get(e));

      // If e’s respond-with error flag is set, set handleFetchFailed to true.
      if (respondWithErrorFlag.get(e)) {
        handleFetchFailed = true;
      }

      // Else, set response to e’s potential response.
      else {
        response = potentialResponse.get(e)!;
      }
    }

    // If response is null, request’s body is not null, and request’s body's source is null, then:
    if (response == null && request.body != null) {
      // Else, cancel request’s body with undefined.
      request.body.cancel();
    }

    // If response is not null, then set response’s service worker timing info to timingInfo.
    if (response != null) {
      // @ts-ignore
      response.serviceWorkerTimingInfo = timingInfo;
    }

    // If e’s canceled flag is set, set eventCanceled to true.
    if (e.defaultPrevented) {
      eventCanceled = true;
    }
  })();
  // If task is discarded, set handleFetchFailed to true.
  // The task must use activeWorker’s event loop and the handle fetch task source.

  // Wait for task to have executed or for handleFetchFailed to be true.
  await Promise.race([task, waitUntil(() => handleFetchFailed)]);

  // If respondWithEntered is false, then:
  if (!respondWithEntered) {
    // If eventCanceled is true, then:
    if (eventCanceled) {
      // If eventHandled is not null, then reject eventHandled with a "NetworkError" DOMException in workerRealm.
      if (eventHandled != null) {
        eventHandled_reject(new DOMException(undefined, "NetworkError"));
      }

      // Return a network error.
      return Response.error();
    }

    // If eventHandled is not null, then resolve eventHandled.
    if (eventHandled != null) {
      eventHandled_resolve();
    }

    // Return null.
    return null;
  }

  // If handleFetchFailed is true, then:
  if (handleFetchFailed) {
    // If eventHandled is not null, then reject eventHandled with a "NetworkError" DOMException in workerRealm.
    if (eventHandled != null) {
      eventHandled_reject(new DOMException(undefined, "NetworkError"));
    }

    // Return a network error.
    return Response.error();
  }

  // If eventHandled is not null, then resolve eventHandled.
  if (eventHandled != null) {
    eventHandled_resolve();
  }

  // Return response.
  return response;
}

export default handleFetch;
