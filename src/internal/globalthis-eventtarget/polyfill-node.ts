declare global {
  var addEventListener: EventTarget["addEventListener"];
  var removeEventListener: EventTarget["removeEventListener"];
  var dispatchEvent: EventTarget["dispatchEvent"];
}

const target = new EventTarget();

globalThis.addEventListener = target.addEventListener;
globalThis.removeEventListener = target.removeEventListener;
globalThis.dispatchEvent = target.dispatchEvent;

// We can do this because Node.js stores all private data in symbols! Node.js
// also uses custom [kNewListener] and other symbol-based "protected" methods,
// so we need to do this on the whole prototype chain (which is just 2 levels).
for (const s of Object.getOwnPropertySymbols(target)) {
  globalThis[s] = target[s];
}
for (const s of Object.getOwnPropertySymbols(EventTarget.prototype)) {
  globalThis[s] = target[s];
}

export {};
