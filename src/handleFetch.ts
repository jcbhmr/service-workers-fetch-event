async function handleFetch(
  request: Request,
  controller: any,
  useHighResPerformanceTimers: boolean
): Promise<Response> {
  // 1. Let handleFetchFailed be false.
  let handleFetchFailed = false;

  // 2. Let respondWithEntered be false.
  let respondWithEntered = false;

  // 3. Let eventCanceled be false.
  let eventCanceled = false;

  // 4. Let response be null.
  let response = null;

  // 5. Let registration be null.
  let registration = null;

  // 10. Let eventHandled be null.
  let eventHandled = null;

  // 12. Assert: request’s destination is not "serviceworker".
  console.assert(request.destination !== "serviceworker");

  // 13. If request’s destination is either "embed" or "object", then:
  if (request.destination === "embed" || request.destination === "object") {
    // 1. Return null.
    return null;
  }

  // If the result of running the Should Skip Event algorithm with "fetch" and activeWorker is true, then:
  if (shouldSkipEvent("fetch", undefined)) {
    // 2. Return null.
    return null;
  }

  // If activeWorker’s all fetch listeners are empty flag is set:
  if (allFetchListenersAreEmpty) {
    // 1. Return null.
    return null;
  }

  // Let timingInfo’s start time be the coarsened shared current time given useHighResPerformanceTimers.
  const timingInfo = {};
  timingInfo.startTime = performance.now();

  // Set eventHandled to a new promise in workerRealm.
  eventHandled = new Promise();

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
      await waitUntil(() => !respondFlag.get(e));

      // If e’s respond-with error flag is set, set handleFetchFailed to true.
      if (respondWithErrorFlag.get(e)) {
        handleFetchFailed = true;
      }

      // Else, set response to e’s potential response.
      else {
        response = e.potentialResponse;
      }
    }

    // If response is null, request’s body is not null, and request’s body's source is null, then:
    if (response == null && request.body != null) {
      // Else, cancel request’s body with undefined.
      request.body.cancel();
    }

    // If response is not null, then set response’s service worker timing info to timingInfo.
    if (response != null) {
      // response.serviceWorkerTimingInfo = timingInfo
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
      return new Response(null, { status: 500 });
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
    return new Response(null, { status: 500 });
  }

  // If eventHandled is not null, then resolve eventHandled.
  if (eventHandled != null) {
    eventHandled_resolve();
  }

  // Return response.
  return response;
}
