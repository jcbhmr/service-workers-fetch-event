import "@jcbhmr/service-workers-fetch-event.node";

onfetch = (e) => {
  const url = new URL(e.request.url);
  if (url.pathname === "/api/process-env.json") {
    e.respondWith(Response.json(process.env));
  }
};
