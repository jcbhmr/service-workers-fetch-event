interface FetchEventInit extends ExtendableEventInit {
  request: Request;
  preloadResponse?: Promise<any>;
  clientId?: string;
  resultingClientId?: string;
  replacesClientId?: string;
  handled?: Promise<undefined>;
}
const FetchEventInit = {
  from(o: unknown): {
    request: Request;
    preloadResponse?: Promise<any>;
    clientId: string;
    resultingClientId: string;
    replacesClientId: string;
    handled?: Promise<undefined>;
  } {
    o ??= {};
    if (!(o.request instanceof Request)) {
      throw new TypeError();
    }
    o.clientId ??= "";
    o.resultingClientId ??= "";
    o.replacesClientId ??= "";
    return o;
  },
};

export type { FetchEventInit as default };
