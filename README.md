![🚧 Under construction 👷‍♂️](https://i.imgur.com/LEP2R3N.png)

# `onfetch` for Node.js

🌐 Write Node.js HTTP servers like service workers

<div align="center">

</div>

🌟 Uses web-native `Request` and `Response` \
⏱ Includes a proper `FetchEvent` \
😎 You can just `onfetch = ...` \
📂 Non-`.respondWith()` default to static files \
❌ No support for `oninstall` and `onactivate`

## Installation

```sh
npm install @jcbhmr/service-workers-fetch-event.node
```

⚠️ This package is intended for use with Node.js! If you're using Node.js <18
(doesn't have `Request` and `Response` natives), you'll need to provide a
suitable polyfill like [nodejs/undici] applied to the global scope.

## Usage

```js
import "@jcbhmr/service-workers-fetch-event.node";

onfetch = (e) => e.respondWith(new Response("Hello world!"));
```

### How it works

As soon as an `onfetch` event is registered, we spin up an HTTP server. If the
`onfetch` event gets de-registered or <kbd>^C</kbd> happens, we terminate. All
non-`.respondWith()` events get passed along to a static file server handler by
default. You can set the `process.env.BASE_URL` to `null` or `about:invalid` or
any other bogus URL to disable this. If no `BASE_URL` is set, we default to the
`process.cwd()` to serve static files from.

### Why no `oninstall` and `onactivate`?

When service workers upgrade, they will gracefully phase out the old one. We
can't really emualte that behaviour in Node.js. These events also need to only
fire when the service worker is "new", not every startup. Thus, we'd need to
index the entire dependency tree on startup and only emit these events if any of
the files changed (thus warranting an "upgrade").

This is all outside the scope of a polyfill shim, and more in the realm of
something like a load balancer process that delegates to service worker -ish
`Worker` threads to handle requests. That's outside the scope of this polyfill,
but does sound like a cool project! Let me know if you make something like that!

## Alternatives

If you're using Deno, you should probably be using
[worker-tools/deno-fetch-event-adapter] instead of this package. When using
other worker-like platforms like Cloudflare Workers, you can just rely on their
native `onfetch` behaviour to work for you!

## Development

This package is made using TypeScript, Vite, and Vitest. You can get started
tinkering by running `npm start`; this will start the test watcher so you can
see your changes reflect in tests in real time. There's also some example
projects in the `examples/` folder that you should manually test to make sure
they work.

<!-- prettier-ignore-start -->
[worker-tools/deno-fetch-event-adapter]: https://github.com/worker-tools/deno-fetch-event-adapter#readme
[nodejs/undici]: https://github.com/nodejs/undici#readme
<!-- prettier-ignore-end -->
