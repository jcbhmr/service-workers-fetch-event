/**
 * This file is the entry point for the `globalThis` polyfill. It checks if
 * `globalThis` is defined, and if not, it polyfills it with `EventTarget`.
 *
 * Currently, we only have an implementation for Node.js, as browsers already
 * have `EventTarget`. The parent package is also only intended for Node.js, so
 * this is fine for now. In the future this could become its own package, and we
 * could add support for other environments. But that's not needed right now.
 *
 * @file
 */

if (typeof dispatchEvent === "undefined") {
  if (typeof process !== "undefined") {
    await import("./polyfill-node");
  } else {
    console.warn("TODO: Good warning message");
  }
}

export {};
