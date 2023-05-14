import "../src/index";
import { test, expect, assert } from "vitest";

test("onfetch is global", () => {
  expect(globalThis.onfetch).toBeDefined();
});

test("it forwards to static files", async () => {
  const response = await fetch("http://localhost:8080/README.md");
  const text = await response.text();
  expect(response.status).toBe(200);
  expect(text.length).toBeGreaterThan(0);
});

test("it works with a custom handler", async () => {
  onfetch = (e) => e.respondWith(new Response("Hello, world!"));

  const response = await fetch("http://localhost:8080/README.md");
  const text = await response.text();
  expect(response.status).toBe(200);
  expect(text).toBe("Hello, world!");
});

test("it works with a custom handler that returns a promise", async () => {
  onfetch = (e) =>
    e.respondWith(Promise.resolve(new Response("Hello, world!")));

  const response = await fetch("http://localhost:8080/README.md");
  const text = await response.text();
  expect(response.status).toBe(200);
  expect(text).toBe("Hello, world!");
});

test("it works with a handler and static files", async () => {
  onfetch = (e) => {
    if (e.request.url === "http://localhost:8080/api/hello") {
      e.respondWith(new Response("Hello, world!"));
    }
  };

  const response = await fetch("http://localhost:8080/README.md");
  const text = await response.text();
  expect(response.status).toBe(200);
  expect(text.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:8080/api/hello");
  const text2 = await response2.text();
  expect(response2.status).toBe(200);
  expect(text2).toBe("Hello, world!");
});

test("it works with .respondWith(fetch())", async () => {
  onfetch = (e) => e.respondWith(fetch(e.request));

  const response = await fetch("http://localhost:8080/README.md");
  const text = await response.text();
  expect(response.status).toBe(200);
  expect(text.length).toBeGreaterThan(0);
});

test("it works when .respondWith() rejects", async () => {
  onfetch = (e) => e.respondWith(Promise.reject(new Error("Oops!")));

  const response = await fetch("http://localhost:8080/README.md");
  expect(response.status).toBe(500);
});
