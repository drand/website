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

First import the base client, which wraps clients operating over different transports with configured aggregation, caching, and retry logic:

```go
import (
    "github.com/drand/drand/client"
)
```

In general, when using the client you _should_ use the `WithChainHash` or `WithChainInfo` option in order for your client to validate the randomness it receives is from the correct chain. You _may_ use the `Insecurely` option to bypass this validation but it is not recommended.

#### HTTP

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
