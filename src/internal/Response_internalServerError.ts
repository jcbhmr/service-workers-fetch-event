export default function Response_internalServerError(error: any): Response {
  return new Response("" + (error?.stack || error), {
    status: 500,
    statusText: "Internal Server Error",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
}
