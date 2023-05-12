if (typeof dispatchEvent === "undefined" && typeof process !== "undefined") {
  await import("./polyfill-node");
}

export {};
