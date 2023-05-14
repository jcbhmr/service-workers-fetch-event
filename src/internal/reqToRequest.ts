import { Readable } from "node:stream";
import type { IncomingMessage } from "node:http";

export default function reqToRequest(req: IncomingMessage): Request {
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
  return request;
}
