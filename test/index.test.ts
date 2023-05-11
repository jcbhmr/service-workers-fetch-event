import { test, expect, assert } from "vitest";
import "../src/index";

test("onfetch is global", () => {
  expect(globalThis.onfetch).toBeDefined();
});
