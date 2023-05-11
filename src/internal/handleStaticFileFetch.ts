import { openAsBlob } from "node:fs";
import { pathToFileURL } from "node:url";

export default async function handleStaticFileFetch(
  request: Request
): Promise<Response> {
  const url = new URL(request.url);
  const baseURL = pathToFileURL(process.cwd());
  const fileURL = new URL(url.pathname.slice(1), baseURL);
  const mimeType = mime.lookup(fileURL);
  const blob = await openAsBlob(fileURL, { type: mimeType });
  return new Response(blob);
}
