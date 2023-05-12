export default function Response_methodNotAllowed(): Response {
  return new Response("Method Not Allowed", {
    status: 405,
    statusText: "Method Not Allowed",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
}
