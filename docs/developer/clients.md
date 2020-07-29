# Client libraries

Client libraries enable easy access to drand randomness in specific programming languages. They also provide peace of mind by _verifying_ randomness rounds and add additional features like failover, racing, aggregation, and caching.

Drand randomness is available over [HTTP](/developer/http-api/), [libp2p PubSub](/developer/gossipsub/) and gRPC.

Currently, the following client libraries are available:

- [Go](#go)
- [JS](#js)

If your application cannot use the libraries above, you can still use the [drand-client CLI](/developer/drand-client) or make requests to the [HTTP API](/developer/http-api/) endpoints. If you have created a client library or know of a client library not listed here, [please let us know by opening an issue](https://github.com/drand/website/issues/new).

## Go

The Go drand client library is structured with a base client interface in `/client`, and with protocol-specific transport implementations in `/client/http`, `/client/grpc` and `/lp2p/client`. The main `client` package holds transport agnostic logic for retrying, validation, and caching.

For documentation and examples please check the Go clients reference:

* Transport agnostic top-level client: [https://pkg.go.dev/github.com/drand/drand/client](https://pkg.go.dev/github.com/drand/drand/client)

Client implementations (to be used with the above):

* [HTTP](/developer/http-api/) client: [https://pkg.go.dev/github.com/drand/drand/client/http](https://pkg.go.dev/github.com/drand/drand/client/http)
* [libp2p gossip](/developer/gossipsub) client: [https://pkg.go.dev/github.com/drand/drand/lp2p/client](https://pkg.go.dev/github.com/drand/drand/lp2p/client)
* gRPC client: [https://pkg.go.dev/github.com/drand/drand/client/grpc](https://pkg.go.dev/github.com/drand/drand/client/grpc)


## JS

### Install

In the browser or [Deno](https://deno.land) you can grab and use the client from a CDN e.g. [https://cdn.jsdelivr.net/npm/drand-client/drand.js](https://cdn.jsdelivr.net/npm/drand-client/drand.js).

In [Node.js](https://nodejs.org), install with:

```sh
npm install drand-client
```

### Usage

[API reference on github.com](https://github.com/drand/drand-client#api)

```html
<script type="module">
  import Client, { HTTP } from 'https://cdn.jsdelivr.net/npm/drand-client/drand.js'

  const chainHash = '8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce' // (hex encoded)
  const urls = [
    'https://api.drand.sh',
    'https://drand.cloudflare.com'
    // ...
  ]

  async function main() {
    const options = { chainHash }

    const client = await Client.wrap(HTTP.forURLs(urls, chainHash), options)

    // e.g. use the client to get the latest randomness round:
    const res = await client.get()

    console.log(res.round, res.randomness)
  }

  main()
</script>
```

::: details The client also works in Deno and Node.js.
Usage in Deno is the same as in the browser, minus the HTML `<script>` tag. Ensure you run your script with the the `--allow-net` flag e.g. `deno run --allow-net client.js`.

If you'd like to run it in Node.js, add [`fetch`](http://npm.im/node-fetch) and [`AbortController`](http://npm.im/abort-controller) as globals e.g.

```js
import Client, { HTTP } from 'drand-client'
import fetch from 'node-fetch'
import AbortController from 'abort-controller'

global.fetch = fetch
global.AbortController = AbortController

// Use as per browser example...
```

**From common.js:**

```js
const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const { default: Client, HTTP } = await import('drand-client')

global.fetch = fetch
global.AbortController = AbortController

// Use as per browser example...
```

:::

The `wrap` function provides a single entrypoint for wrapping concrete client implementation(s) with configured aggregation, caching, and retry logic. Only HTTP transport is available in the JS client currently. Note that you are not restricted to just one client. You can use multiple clients of the same type or of different types. The base client will periodically "speed test" it's clients, failover, cache results and aggregate calls to `watch` to reduce requests.

::: warning
When using the client you _should_ use the `chainHash` or `chainInfo` option in order for your client to validate the randomness it receives is from the correct chain. You _may_ use the `insecure` option to bypass this validation but it is not recommended.
:::

The [League of Entropy](https://blog.cloudflare.com/league-of-entropy/) run a network of drand nodes and provide a set of public HTTP API endpoints, which are listed in the [HTTP API reference](/developer/http-api/).

Consult the [API reference](https://github.com/drand/drand-client#api) for more information.
