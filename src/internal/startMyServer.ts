import { createServer as http_createServer } from "node:http";
import { createServer as http2_createServer } from "node:http2";
import type { Server } from "node:http";
import type { Http2Server } from "node:http2";
import { Readable } from "node:stream";
import { promisify } from "node:util";
import Response_internalServerError from "./Response_internalServerError";
import handleRequest from "./handleRequest";
import applyResponseToRes from "./applyResponseToRes";
import reqToRequest from "./reqToRequest";

// TODO: Support HTTP/2
// TODO: Support HTTPS

let server: Http2Server | Server | null | undefined;
let origin: string | null | undefined;
async function startMyServer() {
  server = http_createServer(async (req, res) => {
    const request = reqToRequest(req);
    const response = await handleRequest(request).catch((reason) =>
      Response_internalServerError(reason)
    );
    applyResponseToRes(response, res);
  });
  const server_listen = promisify(server.listen.bind(server));

  const host = process.env.HOST || "localhost";
  const port = process.env.PORT || "8080";
  await server_listen({ host, port });

  origin = `http://${host}:${port}`;
  console.debug(`HTTP server listening on ${origin}`);
}

export default startMyServer;
