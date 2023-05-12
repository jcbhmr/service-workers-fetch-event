import { pathToFileURL } from "node:url";
import handleStaticFileFetch from "./handleStaticFileFetch";

function specialFetch(
  $1: Parameters<typeof fetch>[0],
  $2: Parameters<typeof fetch>[1]
): ReturnType<typeof fetch> {
  if (isStarted()) {
    // @ts-ignore
    const request = new Request(...arguments);
    if (request.url.startsWith("" + pathToFileURL(process.cwd() + "/"))) {
      return handleStaticFileFetch(request).then((r) => r ?? Response.error());
    }
  }

  return fetch.call(this, ...arguments);
}
