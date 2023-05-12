import "@jcbhmr/service-workers-fetch-event.node";

onfetch = (e) => {
  const url = new URL(e.request.url);
  console.debug(e.request.method, url.pathname);
  if (url.pathname === "/api/datetime.txt") {
    e.respondWith(new Response(new Date().toISOString()));
  }
};
