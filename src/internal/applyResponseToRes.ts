import { Readable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";

export default function applyResponseToRes(
  response: Response,
  res: ServerResponse & { req: IncomingMessage }
): void {
  res.writeHead(
    response.status || 500,
    response.statusText,
    Object.fromEntries(response.headers)
  );
  if (response.body) {
    // @ts-ignore
    Readable.fromWeb(response.body).pipe(res);
  } else {
    res.end();
  }
}
