if (typeof onfetch !== "undefined") {
  process.emitWarning("onfetch is already defined");
}

// Unconditionally apply the polyfill to the global scope. If it fails, it's
// probably because the user isn't in a Node.js environment.
await import("./polyfill");

export {};
