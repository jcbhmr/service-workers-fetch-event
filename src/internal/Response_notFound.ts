export default function Response_notFound(): Response {
  return new Response("Not Found", {
    status: 404,
    statusText: "Not Found",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
}
