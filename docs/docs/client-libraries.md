# Client Libraries

Client libraries enable easy access to drand randomness in specific programming languages. They also provide piece of mind by _verifying_ randomness rounds and add additional features like failover, racing, aggregation, and caching.

Drand randomness is available over HTTP, [gRPC](https://grpc.io/) and [libp2p PubSub](https://docs.libp2p.io/concepts/publish-subscribe/), but availability of transports other than HTTP in client libraries is implementation dependent.

Choose a drand client library that matches the language in which your application is written:

- **Go**
  - [API Reference](https://pkg.go.dev/github.com/drand/drand/client)
  - [Repo](https://github.com/drand/drand)
- **JS**
  - [API Reference](https://www.npmjs.com/package/drandjs)
  - [Repo](https://github.com/drand/drandjs)

Language not listed? You can make raw requests to the [HTTP API](/docs/http-api/). If you have created a client library or know of a client library not listed here, [please let us know by opening an issue](https://github.com/drand/website/issues/new).
