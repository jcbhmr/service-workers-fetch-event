import ExtendableEventInit from "./ExtendableEventInit";

interface FetchEventInit extends ExtendableEventInit {
  request: Request;
  preloadResponse?: Promise<any>;
  clientId?: string;
  resultingClientId?: string;
  replacesClientId?: string;
  handled?: Promise<undefined>;
}
const FetchEventInit = {
  from(o: FetchEventInit): {
    request: Request;
    preloadResponse?: Promise<any>;
    clientId: string;
    resultingClientId: string;
    replacesClientId: string;
    handled?: Promise<undefined>;
  } & ExtendableEventInit {
    if (Object.prototype.toString.call(o.request).slice(8, -1) !== "Request") {
      throw new TypeError(`${o.request} is not a Request`);
    }
    o.clientId ??= "";
    o.resultingClientId ??= "";
    o.replacesClientId ??= "";
    return o as {
      request: Request;
      preloadResponse?: Promise<any>;
      clientId: string;
      resultingClientId: string;
      replacesClientId: string;
      handled?: Promise<undefined>;
    } & ExtendableEventInit;
  },
};

export default FetchEventInit;
