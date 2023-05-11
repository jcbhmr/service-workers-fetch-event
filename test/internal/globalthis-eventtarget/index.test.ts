import { test, expect, assert } from "vitest";
import "../../../src/internal/globalthis-eventtarget/index";

test("global addEventListener, removeEventListener, and dispatchEvent", () => {
  expect(globalThis.addEventListener).toBeDefined();
  expect(globalThis.removeEventListener).toBeDefined();
  expect(globalThis.dispatchEvent).toBeDefined();
});

test("dispatching events", () => {
  let eventReceived = false;

  const eventListener = () => {
    eventReceived = true;
  };

  globalThis.addEventListener("customEvent", eventListener);
  globalThis.dispatchEvent(new CustomEvent("customEvent"));

  expect(eventReceived).toBe(true);

  globalThis.removeEventListener("customEvent", eventListener);
});

test("adding and removing event listeners", () => {
  let eventReceived = false;

  const eventListener = () => {
    eventReceived = true;
  };

  globalThis.addEventListener("customEvent", eventListener);
  globalThis.dispatchEvent(new CustomEvent("customEvent"));

  expect(eventReceived).toBe(true);

  eventReceived = false;
  globalThis.removeEventListener("customEvent", eventListener);
  globalThis.dispatchEvent(new CustomEvent("customEvent"));

  expect(eventReceived).toBe(false);
});

test("target property of events", () => {
  let targetValue: any;

  const eventListener = (event: CustomEvent) => {
    targetValue = event.target;
  };

  globalThis.addEventListener("customEvent", eventListener);
  globalThis.dispatchEvent(new CustomEvent("customEvent"));

  expect(targetValue).toBe(globalThis);

  globalThis.removeEventListener("customEvent", eventListener);
});
