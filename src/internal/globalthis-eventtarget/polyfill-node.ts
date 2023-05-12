/**
 * This uses Node.js-specific APIs to polyfill `globalThis` with `EventTarget`.
 * This is only needed for Node.js, as browsers already have `EventTarget`. We
 * do this by creating a new `EventTarget` and copying all of its properties and
 * symbols to `globalThis`. This is a bit hacky, but it works because Node.js
 * uses symbols for all private data. We also need to pass `isEventTarget()` by
 * having the constructor have the static `[kIsEventTarget]` symbol. To do that
 * we just set `globalThis.constructor = EventTarget`.
 *
 * There's a lot of `@ts-ignore` in this file, but that's because we're
 * overwriting a bunch of pre-typed things in a way that you're generally not
 * supposed to do. That's OK as long as we're careful.
 *
 * @file
 */

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
// @ts-ignore
globalThis.dispatchEvent = target.dispatchEvent;

// We can do this because Node.js stores all private data in symbols! Node.js
// also uses custom [kNewListener] and other symbol-based "protected" methods,
// so we need to do this on the whole prototype chain (which is just 2 levels).
for (const s of Object.getOwnPropertySymbols(target)
  .concat(Object.getOwnPropertySymbols(EventTarget.prototype))
  .filter((s) => !s.description?.startsWith("Symbol."))) {
  globalThis[s] = target[s];
}

// We also need to pass isEventTarget() by having the constructor have the
// static [kIsEventTarget] symbol. We could create a Proxy around the original
// constructor, but that would be a lot of work for little gain. This should
// work just fine in most cases, and might actually be preferable.
globalThis.constructor = EventTarget;

export {};
