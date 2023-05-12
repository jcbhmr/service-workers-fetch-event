## What's in the name?

The name @jcbhmr/service-workers-fetch-event.node is a bit of a mouthful. It's
derived from the "service-workers" short ID from [w3.org/TR/service-workers].
The "fetch-event" part is from [#service-worker-global-scope-fetch-event] with
the "global-scope" part removed because it's implied. The ".node" part is
because this is a Node.js-specific polyfill. Other implementations exist! If
you're looking for a Deno version, check out [@worker-tools]'
[worker-tools/deno-fetch-event-adapter].

Note that we are using "service-worker" from the official W3C Technical Report,
not "serviceworker" from the nightly Editor's Draft version at
[w3c.github.io/ServiceWorker].

## Why is `fetch()` overridden?

The `fetch()` function is overridden so that when you do something silly like:

```js
onfetch = (e) => e.respondWith(fetch(e.request));
```

You don't get an infinite loop. Instead, the special `fetch()` function will
detect that this request's URL is one that we're serving, and will delegate to
the default static file server handler instead.

We use an origin-based `Set` to track all incoming URL's origins so that we can
sniff the origin of an outgoing `fetch()` request and determine if it's one that
we're serving or not. When a request comes in, the first thing we do is add
`new URL(request.url).origin` to the `Set`. When a `fetch()` request is made, if
it matches one of the origins in the `Set`, we delegate to the static file
server handler. Otherwise, we delegate to the native `fetch()` function.

## What's in `request.url`?

Typically, a `request.url` from an `onfetch` event looks like:

```
https://jcbhmr-jubilant-eureka-jg9qrgvxrq2p7x-8000.preview.app.github.dev/api/datetime.txt?foo=bar
http://localhost:8000/api/datetime.txt?foo=bar
http://[::1]:8000/api/datetime.txt?foo=bar
```

We use HTTP/2 by default, which offers an implicit `:authority` header that
contains the host and port. We also support HTTP/1.1, where we use the `Host`
header to determine the host and port.

```
HTTP/2
http://localhost:8000/api/datetime.txt?foo=bar
^^^^   ^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^
|      |              `-- :path
|      `-- :authority
`-- :scheme
```

```
HTTP/1.1
http://localhost:8000/api/datetime.txt?foo=bar
       ^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^
       |              `-- pathname
       `-- Host
```

Note that we can't determine the scheme from HTTP/1.1, so we use the default
scheme of `http` instead. And, sometimes the `Host:` header isn't present, so we
use the `0.0.0.0` as the default host instead.

## `Response.error()` vs `new Response(null, { status: 500 })`

**`Response.error()` is for signalling only.** It's not meant to be returned to
the actual underlying HTTP serialization layer. If it is, it will throw, because
the `status: 0` property is invalid!

```sh
RangeError [ERR_HTTP_INVALID_STATUS_CODE]: Invalid status code: 0
    at new NodeError (node:internal/errors:399:5)
    at ServerResponse.writeHead (node:_http_server:339:11)
```

Instead, you should use `new Response(null, { status: 500 })` to signal an
irrecoverable error to the underlying HTTP serialization layer. If possible, try
to include some kind of error page.

Another case is `new Response(null, { status: 404 })`. This is a valid response
that should be returned if the file doesn't exist, just like a normal HTTP
server. This pattern is used in the default static file server handler, even
though the `openAsBlob()` throws errors and would cause a 500 error if not
caught.

<!-- prettier-ignore-start -->
[#service-worker-global-scope-fetch-event]: https://w3c.github.io/ServiceWorker/#service-worker-global-scope-fetch-event
[w3.org/TR/service-workers]: https://www.w3.org/TR/service-workers/
[w3c.github.io/ServiceWorker]: https://w3c.github.io/ServiceWorker/
[@worker-tools]: https://github.com/worker-tools
<!-- prettier-ignore-end -->
