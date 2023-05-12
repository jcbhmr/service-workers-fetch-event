import { createServer as http_createServer } from "node:http";
import { createServer as http2_createServer } from "node:http2";
import type { Server } from "node:http";
import type { Http2Server } from "node:http2";
import { Readable } from "node:stream";
import { promisify } from "node:util";
import Response_internalServerError from "./Response_internalServerError";
import handleRequest from "./handleRequest";

// TODO: Support HTTP/2
// TODO: Support HTTPS

let server: Http2Server | Server | null | undefined;
let origin: string | null | undefined;
async function startMyServer() {
  server = http_createServer((req, res) => {
    // handleRequest() takes in a Request and returns a Response. We need to
    // convert the Node.js request and response objects into native web ones.
    const protocol = "http:";
    const host = req.headers.host || "localhost";
    const pathname = req.url || "/";
    const url = new URL(pathname, protocol + "//" + host);
    const method = req.method || "GET";
    // @ts-ignore
    const headers = new Headers(req.headers);
    const body =
      method === "GET" || method === "HEAD"
        ? null
        : (Readable.toWeb(req) as ReadableStream<Uint8Array>);
    const request = new Request("" + url, { method, headers, body });

    handleRequest(request)
      .catch((reason) => Response_internalServerError(reason))
      .then((response) => {
        // Content-Length is included (when determinable) in the headers map
        // from the Response object. Don't worry!
        res.writeHead(
          response.status,
          response.statusText,
          Object.fromEntries(response.headers)
        );
        // @ts-ignore
        Readable.fromWeb(response.body).pipe(res);
      });
  });
  const server_listen = promisify(server.listen.bind(server));

  const host = process.env.HOST || "localhost";
  const port = process.env.PORT || "8080";
  await server_listen({ host, port });

  origin = `http://${host}:${port}`;
  console.debug(`HTTP server listening on ${origin}`);
}

export default startMyServer;
