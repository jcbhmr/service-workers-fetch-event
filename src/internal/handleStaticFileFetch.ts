// @ts-ignore
import { openAsBlob } from "node:fs";
import { pathToFileURL } from "node:url";
import mime from "mime-types";

declare var openAsBlob: (
  path: string | Buffer | URL,
  options?: { type?: string }
) => Promise<Blob>;

async function handleStaticFileFetch(
  request: Request
): Promise<Response | null> {
  const url = new URL(request.url);
  const baseURL = pathToFileURL(process.cwd() + "/");

  const fileURL = new URL(url.pathname.slice(1), baseURL);
  if (fileURL.pathname.endsWith("/")) {
    fileURL.pathname += "index.html";
  }
  const mimeType = mime.lookup("" + fileURL) || "";

  // Throws synchronous errors, so we wrap inside a Promise context.
  const blob = await Promise.resolve()
    .then(() => openAsBlob(fileURL, { type: mimeType }))
    .catch(() => null);
  return blob ? new Response(blob) : null;
}

export default handleStaticFileFetch;
