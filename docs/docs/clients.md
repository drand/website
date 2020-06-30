# Client libraries

Client libraries enable easy access to drand randomness in specific programming languages. They also provide piece of mind by _verifying_ randomness rounds and add additional features like failover, racing, aggregation, and caching.

Drand randomness is available over HTTP, [gRPC](https://grpc.io/) and [libp2p PubSub](https://docs.libp2p.io/concepts/publish-subscribe/), but availability of transports other than HTTP in client libraries is implementation dependent.

Choose a drand client library that matches the language in which your application is written:

- [Go](#go)
- [JS](#js)

Language not listed? You can make raw requests to the [HTTP API](/docs/http-api/). If you have created a client library or know of a client library not listed here, [please let us know by opening an issue](https://github.com/drand/website/issues/new).

## Go

### Install

```sh
go get github.com/drand/drand
```

### Usage

First import the base client, which wraps clients operating over different transports (HTTP, gRPC, libp2p PubSub etc.) with configured aggregation, caching, and retry logic:

```go
package main

import (
    "context"
    "fmt"
    "github.com/drand/drand/client"
)

const chainHash = "c599c267a0dd386606f7d6132da8327d57e1004760897c9dd4fb8495c29942b2"

func main() {
    c := client.New(
        client.From(/* add concrete client implementations here (see below) */),
        client.WithChainHash(chainHash),
    )

    r := c.Get(context.Background(), 0) // get the latest randomness round

    fmt.Println(r.Round(), r.Randomness())
}
```

The `From` option allows you to specify clients that work over particular transports. HTTP, gRPC and libp2p PubSub clients are provided. Note that you are not restricted to just one client. You can use multiple clients of the same type or of different types. The base client will periodically "speed test" it's clients, failover, cache results and aggregate calls to `Watch` to reduce requests.

::: warning
When using the client you _should_ use the `WithChainHash` or `WithChainInfo` option in order for your client to validate the randomness it receives is from the correct chain. You _may_ use the `Insecurely` option to bypass this validation but it is not recommended.
:::

#### HTTP

The HTTP client allows for fetching randomness over the [JSON HTTP API](/docs/http-api/). Watching is implemented by polling the endpoint at the expected round time. The [League of Entropy](https://blog.cloudflare.com/league-of-entropy/) provides a set of public HTTP API endpoints, which are listed in the [HTTP API reference](/docs/http-api/).

```go
package main

import (
    "context"
    "fmt"
    "github.com/drand/drand/client"
    "github.com/drand/drand/client/http"
)

const (
    chainHash = "c599c267a0dd386606f7d6132da8327d57e1004760897c9dd4fb8495c29942b2"
    url       = "https://drand.cloudflare.com"
)

func main() {
    c := client.New(
        client.From(http.ForURLs([]string{url}, chainHash)...),
        client.WithChainHash(chainHash),
    )
}
```

The `ForURLs` helper creates multiple HTTP clients from a list of URLs. Alternatively you can use the `New` or `NewWithInfo` constructor to create clients.

:::tip
Provide multiple URLs to enable failover and speed optimised URL selection.
:::

#### gRPC

#### Libp2p PubSub

### API

[API reference on pkg.go.dev](https://pkg.go.dev/github.com/drand/drand/client)

## JS

### Install

```sh
npm install drandjs
```

### Usage

### API

[API reference on npmjs.com](https://www.npmjs.com/package/drandjs#api)
