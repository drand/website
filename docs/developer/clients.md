# Client libraries

Client libraries enable easy access to drand randomness in specific programming languages. They also provide piece of mind by _verifying_ randomness rounds and add additional features like failover, racing, aggregation, and caching.

Drand randomness is available over HTTP, [gRPC](https://grpc.io/) and [libp2p PubSub](https://docs.libp2p.io/concepts/publish-subscribe/), but availability of transports other than HTTP in client libraries is implementation dependent.

Choose a drand client library that matches the language in which your application is written:

- [Go](#go)
- [JS](#js)

Language not listed? You can make raw requests to the [HTTP API](/developer/http-api/). If you have created a client library or know of a client library not listed here, [please let us know by opening an issue](https://github.com/drand/website/issues/new).

## Go

### Install

```sh
go get github.com/drand/drand
```

### Usage

[API reference on pkg.go.dev](https://pkg.go.dev/github.com/drand/drand/client)

The drand client library is structured with a base client interface in `/client`, and with protocol-specific transport implementations in `/client/http`, `/client/grpc` and `/lp2p/client`. The main `client` package holds transport agnostic logic for retrying, validation, and caching.

```go
package main

import (
	"context"
	"encoding/hex"
	"fmt"
	"github.com/drand/drand/client"
)

var chainHash, _ = hex.DecodeString("8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce")

func main() {
	c, err := client.New(
		client.From(/* add concrete client implementations here (see below) */),
		client.WithChainHash(chainHash),
	)

	// e.g. use the client to get the latest randomness round:
	r := c.Get(context.Background(), 0)

	fmt.Println(r.Round(), r.Randomness())
}
```

The `From` option allows you to specify clients that work over particular transports. HTTP, gRPC and libp2p PubSub clients are provided. Note that you are not restricted to just one client. You can use multiple clients of the same type or of different types. The base client will periodically "speed test" it's clients, failover, cache results and aggregate calls to `Watch` to reduce requests.

::: warning
When using the client you _should_ use the `WithChainHash` or `WithChainInfo` option in order for your client to validate the randomness it receives is from the correct chain. You _may_ use the `Insecurely` option to bypass this validation but it is not recommended.
:::

In an application that uses the drand client, the following options are likely to be needed/customized:

- `WithCacheSize` should be set to something sensible for your application.
- `WithVerifiedResult` / `WithFullChainVerification` should be set for increased security if you have persistent state and expect to be following the chain.
- `WithAutoWatch` will pre-load new results as they become available, adding them to the cache for speedy retreival when you need them.
- `WithPrometheus` enables metrics reporting on speed and performance to a provided prometheus registry.

Consult the [API reference](https://pkg.go.dev/github.com/drand/drand/client) for more information.

#### HTTP

The HTTP client uses the [JSON HTTP API](/developer/http-api/) to fetch randomness. Watching is implemented by polling the endpoint at the expected round time. The [League of Entropy](https://blog.cloudflare.com/league-of-entropy/) provides a set of public HTTP API endpoints, which are listed in the [HTTP API reference](/developer/http-api/).

```go
package main

import (
	"context"
	"encoding/hex"
	"fmt"
	"github.com/drand/drand/client"
	"github.com/drand/drand/client/http"
)

var urls = []string{
	"https://api.drand.sh",
	"https://drand.cloudflare.com",
	// ...
}

var chainHash, _ = hex.DecodeString("8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce")

func main() {
	c, err := client.New(
		client.From(http.ForURLs(urls, chainHash)...),
		client.WithChainHash(chainHash),
	)
}
```

The `ForURLs` helper creates multiple HTTP clients from a list of URLs. Alternatively you can use the `New` or `NewWithInfo` constructor to create clients.

:::tip
Provide multiple URLs to enable failover and speed optimised URL selection.
:::

Consult the [HTTP client API reference](https://pkg.go.dev/github.com/drand/drand/client/http) for more information.

#### gRPC

The [gRPC](https://grpc.io/) client connects to a drand gRPC endpoint to fetch randomness. The gRPC client has some advantages over the HTTP client - it is more compact on-the-wire and supports streaming and authentication.

```go
package main

import (
	"context"
	"encoding/hex"
	"fmt"
	"github.com/drand/drand/client"
	"github.com/drand/drand/client/grpc"
)

const (
	grpcAddr  = "example.drand.grpc.server:4444"
	certPath  = "/path/to/drand-grpc.cert"
)

var chainHash, _ = hex.DecodeString("8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce")

func main() {
	gc, err := grpc.New(grpcAddr, certPath, false)

	c, err := client.New(
		client.From(gc),
		client.WithChainHash(chainHash),
	)
}
```

A path to a file that holds TLS credentials for the drand server is required to validate server connections. Alternatively set the final parameter to `true` to enable _insecure_ connections (not recommended).

Consult the [gRPC client API reference](https://pkg.go.dev/github.com/drand/drand/client/grpc) for more information.

#### Libp2p PubSub

The [libp2p PubSub](https://docs.libp2p.io/concepts/publish-subscribe/) client is a special type of client called a "watcher" that receives randomness rounds by subscribing to a libp2p PubSub topic.

:::warning
This client can only be used to `Watch` for new randomness rounds and `Get` randomness rounds it has previously seen that are still in the cache.

If you need to `Get` arbitrary rounds from the chain then you must combine this client with a [HTTP](#http) or [gRPC](#grpc) client.
:::

Drand _does not_ publish randomness rounds over libp2p PubSub by default but provides a [relay tool](/operator/drand-cli/#drand-relay-gossip) that performs this task. The [League of Entropy](https://blog.cloudflare.com/league-of-entropy/) provide the following public drand libp2p PubSub relays:

- `/dnsaddr/api.drand.sh`
- `/dnsaddr/api2.drand.sh`
- `/dnsaddr/api3.drand.sh`

:::tip
Connect your libp2p host to one or more of these relays to ensure you continue to receive randomness rounds.
:::

The libp2p PubSub client _must_ be provided `WithChainInfo` in order for it to validate randomness rounds it receives **OR** it _must_ be provided `WithChainHash` _and_ be combined with a [HTTP](#http) or [gRPC](#grpc) client that is able to retrieve the chain information from the server.

It is particularly important that rounds are verified since they can be delivered by _any_ peer in the network.

```go
package main

import (
	"context"
	"fmt"
	"github.com/drand/drand/chain"
	"github.com/drand/drand/client"
	gclient "github.com/drand/drand/lp2p/client"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
)

func main() {
	ps := newPubSub()
	info := readChainInfo()

	c, err := client.New(
		gclient.WithPubsub(ps),
		client.WithChainInfo(info),
	)
}

func newPubSub() *pubsub.Pubsub {
	/* ... */
}

func readChainInfo() *chain.Info {
	/* ... */
}
```

With chain hash and combined with a HTTP client:

```go
package main

import (
	"context"
	"fmt"
	"github.com/drand/drand/chain"
	"github.com/drand/drand/client"
	gclient "github.com/drand/drand/lp2p/client"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
)

var urls = []string{
	"https://api.drand.sh",
	"https://drand.cloudflare.com",
	// ...
}

var chainHash, _ = hex.DecodeString("8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce")

func main() {
	ps := newPubSub()

	c, err := client.New(
		gclient.WithPubsub(ps),
		client.WithChainHash(chainHash),
		client.From(http.ForURLs(urls, chainHash)...),
	)
}

func newPubSub() *pubsub.Pubsub {
	/* ... */
}
```

Consult the [libp2p PubSub client API reference](https://pkg.go.dev/github.com/drand/drand/lp2p/client) for more information.

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
