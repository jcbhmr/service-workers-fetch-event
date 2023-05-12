import type ExtendableEventInit from "./ExtendableEventInit";

export default class ExtendableEvent extends Event {
  constructor(type: string, eventInitDict: ExtendableEventInit = {}) {
    type = "" + type;

    super(type, eventInitDict);
  }

  waitUntil(p_: PromiseLike<any>): void {
    const p = Promise.resolve(p_);

    // Not implemented
  }
}
