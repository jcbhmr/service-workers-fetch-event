import "../src/index";

onfetch = (e) => {
  const url = new URL(e.request.url);
  console.debug(e.request.method, url.pathname);
  if (url.pathname === "/") {
    e.respondWith(new Response("Go to /api/datetime.txt or /README.md"));
  } else if (url.pathname === "/api/datetime.txt") {
    e.respondWith(new Response(new Date().toISOString()));
  }
};
