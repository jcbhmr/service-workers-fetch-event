import ExtendableEvent from "./ExtendableEvent";
import FetchEventInit from "./FetchEventInit";

const waitToRespondFlag = new WeakMap<FetchEvent, boolean | null | undefined>();
const respondWithEnteredFlag = new WeakMap<
  FetchEvent,
  boolean | null | undefined
>();
const respondWithErrorFlag = new WeakMap<
  FetchEvent,
  boolean | null | undefined
>();
const potentialResponse = new WeakMap<
  FetchEvent,
  Response | null | undefined
>();

class FetchEvent extends ExtendableEvent {
  #request: Request;
  #preloadResponse?: Promise<any>;
  #clientId: string;
  #resultingClientId: string;
  #replacesClientId: string;
  #handled?: Promise<undefined>;
  constructor(type: string, eventInitDict_: FetchEventInit) {
    type = "" + type;
    const eventInitDict = FetchEventInit.from(eventInitDict_);

    super(type, eventInitDict);

    this.#request = eventInitDict.request;
    this.#preloadResponse = eventInitDict.preloadResponse;
    this.#clientId = eventInitDict.clientId;
    this.#resultingClientId = eventInitDict.resultingClientId;
    this.#replacesClientId = eventInitDict.replacesClientId;
    this.#handled = eventInitDict.handled;
  }

  get request(): Request {
    return this.#request;
  }

  get preloadResponse(): Promise<any> | undefined {
    return this.#preloadResponse;
  }

  get clientId(): string {
    return this.#clientId;
  }

  get resultingClientId(): string {
    return this.#resultingClientId;
  }

  get replacesClientId(): string {
    return this.#replacesClientId;
  }

  get handled(): Promise<undefined> | undefined {
    return this.#handled;
  }

  respondWith(r_: PromiseLike<Response> | Response): void {
    const r = Promise.resolve(r_);
    // respondWith(r) method steps are:

    // 1. Let event be this.
    const event = this;

    // 2. If event’s dispatch flag is unset, throw an "InvalidStateError" DOMException.
    if (event.eventPhase === Event.NONE) {
      throw new DOMException(undefined, "InvalidStateError");
    }

    // 3. If event’s respond-with entered flag is set, throw an "InvalidStateError" DOMException.
    if (respondWithEnteredFlag.get(this)) {
      throw new DOMException(undefined, "InvalidStateError");
    }

    // 4. Add lifetime promise r to event.
    event.waitUntil(r);
    // NOTE: event.respondWith(r) extends the lifetime of the event by default as if event.waitUntil(r) is called.

    // 5. Set event’s stop propagation flag and stop immediate propagation flag.
    event.stopPropagation();
    event.stopImmediatePropagation();

    // 6. Set event’s respond-with entered flag.
    respondWithEnteredFlag.set(event, true);

    // 7. Set event’s wait to respond flag.
    waitToRespondFlag.set(event, true);

    // 9. Upon rejection of r:
    r.catch((reason) => {
      // 1. Set event’s respond-with error flag.
      respondWithErrorFlag.set(event, true);

      // 2. Unset event’s wait to respond flag.
      waitToRespondFlag.delete(event);

      // Propagate error
      process.emitWarning(reason);
    });

    // 10. Upon fulfillment of r with response:
    r.then((response) => {
      // 1. If response is not a Response object, then set the respond-with error flag.
      if (!(response instanceof Response)) {
        respondWithErrorFlag.set(this, true);
        // NOTE: If the respond-with error flag is set, a network error is returned to Fetch through Handle Fetch algorithm. (See the step 21.1.) Otherwise, the value response is returned to Fetch through Handle Fetch algorithm. (See the step 22.1.)
      }

      // 2. Else:
      else {
        // 1. Let bytes be an empty byte sequence.
        const bytes = new Uint8Array();

        // 2. Let end-of-body be false.
        let endOfBody = false;

        // 3. Let done be false.
        let done = false;

        // 4. Let potentialResponse be a copy of response’s associated response, except for its body.
        const potentialResponse_ = new Response(response.body, response);

        // 6. Set event’s potential response to potentialResponse.
        potentialResponse.set(event, potentialResponse_);

        // 7. Unset event’s wait to respond flag.
        waitToRespondFlag.delete(event);
      }
    });
  }
}

export default FetchEvent;
export {
  waitToRespondFlag,
  respondWithEnteredFlag,
  respondWithErrorFlag,
  potentialResponse,
};
