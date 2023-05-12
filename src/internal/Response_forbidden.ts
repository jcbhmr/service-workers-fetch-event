export default function Response_forbidden(): Response {
  return new Response("Forbidden", {
    status: 403,
    statusText: "Forbidden",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
}
