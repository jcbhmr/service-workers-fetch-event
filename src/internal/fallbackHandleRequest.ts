// @ts-ignore
import { openAsBlob } from "node:fs";
import { pathToFileURL } from "node:url";
import mime from "mime-types";
import Response_notFound from "./Response_notFound";
import Response_forbidden from "./Response_forbidden";
import Response_methodNotAllowed from "./Response_methodNotAllowed";

declare var openAsBlob: (
  path: string | Buffer | URL,
  options?: { type?: string }
) => Promise<Blob>;

async function fallbackHandleRequest(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return Response_methodNotAllowed();
  }

  const url = new URL(request.url);
  const baseURL = pathToFileURL(process.cwd() + "/");
  const fileURL = new URL(url.pathname.slice(1), baseURL);
  if (fileURL.pathname.endsWith("/")) {
    fileURL.pathname += "index.html";
  }

  // Don't allow the user to escape the current directory.
  if (!fileURL.pathname.startsWith(baseURL.pathname)) {
    return Response_forbidden();
  }

  const mimeType = mime.lookup("" + fileURL) || "";
  // Throws synchronous errors, so we wrap inside a Promise context. We also do
  // a Go-style multiple return value to handle both the success and error cases
  // in "pattern matching" style. We could do this with .then() and .catch()
  // chains, but this way is more readable IMO.
  const [blob, error] = await Promise.resolve()
    .then(() => openAsBlob(fileURL, { type: mimeType }))
    .then(
      (value) => [value, undefined],
      (reason) => [undefined, reason]
    );

  if (blob) {
    return new Response(blob);
  }

  // Means that the file couldn't be read. Most likely due to permissions.
  else if (error?.name === "NotReadableError") {
    return Response_forbidden();
  }

  // Means that the file doesn't exist.
  else if (
    error?.name === "TypeError" &&
    error.code === "ERR_INVALID_ARG_VALUE"
  ) {
    return Response_notFound();
  } else {
    throw error;
  }
}

export default fallbackHandleRequest;
