import { test, expect, assert } from "vitest";
import "../src/index";

test("onfetch is global", () => {
  expect(globalThis.onfetch).toBeDefined();
});

test("it starts as soon as onfetch is set", async () => {
  const response1 = await fetch("http://localhost:8000/README.md").catch(
    () => null
  );
  expect(response1?.status).not.toBe(200);

  onfetch = () => {};
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response2 = await fetch("http://localhost:8000/README.md");
  const text2 = await response2.text();
  expect(response2.status).toBe(200);
  expect(text2.length).toBeGreaterThan(0);
});

test("switching out onfetch changes the server", async () => {
  onfetch = (e) => e.respondWith(new Response("Hello, world!"));
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response1 = await fetch("http://localhost:8000/README.md");
  const text1 = await response1.text();
  expect(response1.status).toBe(200);
  expect(text1).toBe("Hello, world!");

  onfetch = (e) => e.respondWith(new Response("Goodbye, world!"));
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response2 = await fetch("http://localhost:8000/README.md");
  const text2 = await response2.text();
  expect(response2.status).toBe(200);
  expect(text2).toBe("Goodbye, world!");
});
