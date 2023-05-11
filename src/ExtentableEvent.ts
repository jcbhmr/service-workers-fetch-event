import type ExtendableEventInit from "./ExtendableEventInit";

export default class ExtendableEvent extends Event {
  constructor(type: string, eventInitDict: ExtendableEventInit = {}) {
    type = "" + type;

    super(type, eventInitDict);
  }

  waitUntil(f: PromiseLike<any>): void {
    f = Promise.resolve(f);

    // Not implemented
  }
}
