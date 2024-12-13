# Client libraries

Client libraries enable easy access to drand randomness in specific programming languages. They also provide peace of mind by _verifying_ randomness rounds and add additional features like failover, racing, aggregation, and caching.

drand randomness is available over [HTTP](/developer/http-api/) and over [libp2p PubSub](/developer/gossipsub/).

Currently, the following client libraries are available:

- [Go](https://github.com/drand/go-clients), to build both PubSub and HTTP clients
- [JS](https://github.com/drand/drand-client), to build HTTP clients
- [Rust](https://github.com/thibmeu/drand-rs/tree/main/drand_core), to build HTTP clients

If your application cannot use the libraries above, you can still make requests to the [HTTP API](/developer/http-api/) endpoints. If you have created a client library or know of a client library not listed here, [please let us know by opening an issue](https://github.com/drand/website/issues/new).

## Go

### Install

```sh
go get github.com/drand/drand/v2@latest
```

### Usage

The Go drand client library is structured with a base client interface in `/client`, and with protocol-specific transport implementations in `/client/http`, `/client/grpc` and `/lp2p/client`. The main `client` package holds transport agnostic logic for retrying, validation, and caching.

For documentation and examples please check the Go clients reference:

* Transport agnostic top-level client: [https://pkg.go.dev/github.com/drand/drand/client](https://pkg.go.dev/github.com/drand/drand/client)

Client implementations (to be used with the above):

* [HTTP](/developer/http-api/) client: [https://pkg.go.dev/github.com/drand/drand/client/http](https://pkg.go.dev/github.com/drand/drand/client/http)
* [libp2p gossip](/developer/gossipsub/) client: [https://pkg.go.dev/github.com/drand/drand/lp2p/client](https://pkg.go.dev/github.com/drand/drand/lp2p/client)
* gRPC client: [https://pkg.go.dev/github.com/drand/drand/client/grpc](https://pkg.go.dev/github.com/drand/drand/client/grpc)


## JS

### Install

In the browser or [Deno](https://deno.land) you can grab and use the client from a CDN e.g. [https://cdn.jsdelivr.net/npm/drand-client/drand.js](https://cdn.jsdelivr.net/npm/drand-client/drand.js).

In [Node.js](https://nodejs.org), install with:

```sh
npm install drand-client
```

### Usage

The JS drand client is an esmodule. It has no dependencies and is not transpiled. It can be `import`ed directly in the browser, Deno or Node.js. In Node.js it can be imported from CommonJS using `await import('...')`.

* [Usage and examples](https://github.com/drand/drand-client#usage)
* [API reference](https://github.com/drand/drand-client#api)

