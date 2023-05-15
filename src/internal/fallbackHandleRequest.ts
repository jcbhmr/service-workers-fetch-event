import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import mime from "mime-types";
import Response_notFound from "./Response_notFound";
import Response_forbidden from "./Response_forbidden";
import Response_methodNotAllowed from "./Response_methodNotAllowed";

const openAsBlob =
  // @ts-ignore
  (await import("node:fs").then((m) => m.openAsBlob)) ??
  (await import("./openAsBlob").then((m) => m.default));

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
  }
  // No such file or directory.
  else if (error?.code === "ENOENT") {
    return Response_notFound();
  }
  // Permission denied.
  else if (error?.code === "EACCESS") {
    return Response_forbidden();
  } else {
    throw error;
  }
}

export default fallbackHandleRequest;
