declare global {
  // @ts-ignore
  var addEventListener: EventTarget["addEventListener"];
  // @ts-ignore
  var removeEventListener: EventTarget["removeEventListener"];
  // @ts-ignore
  var dispatchEvent: EventTarget["dispatchEvent"];
}

const target = new EventTarget();

// @ts-ignore
globalThis.addEventListener = target.addEventListener;
// @ts-ignore
globalThis.removeEventListener = target.removeEventListener;
globalThis.dispatchEvent = target.dispatchEvent;

// We can do this because Node.js stores all private data in symbols! Node.js
// also uses custom [kNewListener] and other symbol-based "protected" methods,
// so we need to do this on the whole prototype chain (which is just 2 levels).
for (const s of Object.getOwnPropertySymbols(target).filter(
  (s) => !s.description?.startsWith("Symbol.")
)) {
  globalThis[s] = target[s];
}
for (const s of Object.getOwnPropertySymbols(EventTarget.prototype).filter(
  (s) => !s.description?.startsWith("Symbol.")
)) {
  globalThis[s] = target[s];
}

// We also need to add the [nodejs.event_target] symbol to the .constructor property
// so that isEventTarget() returns true.
const kIsEventTarget = Object.getOwnPropertySymbols(EventTarget).find(
  (s) => s.description === "nodejs.event_target"
)!;
globalThis.constructor[kIsEventTarget] = true;

export {};
