---
title: 'API and client library documentation'
---

# Developer

This section helps developers build applications that use drand as a source of randomness. For help running your own drand network, see the [Operator's Guide](/operator/).

The current public League of Entropy drand mainnet API endpoints are:

* `api.drand.sh` (HTTP(S) Endpoint)
* `api2.drand.sh` (HTTP(S) Endpoint)
* `api3.drand.sh` (HTTP(S) Endpoint)
* `https://drand.cloudflare.com` (HTTPS Endpoint)
* `/dnsaddr/api.drand.sh` (1st-level gossip relay endpoint)
* `/dnsaddr/api2.drand.sh` (1st-level gossip relay endpoint)
* `/dnsaddr/api3.drand.sh` (1st-level gossip relay endoint)
* Mainnet chain hash: `8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce`

In order to retrieve randomness form a drand network you should **preferentially use the [drand client libraries](/developer/clients/) or the [drand-client CLI](/developer/drand-client/)**, which support the different mechanisms and perform verification for every value obtained.

Alternatively you can interact directly with the endpoints (remembering to manually verify every value):

- [HTTP API reference](/developer/http-api/)
- [Pubsub-based randomness distribution](/developer/gossipsub/)
- GRPC API: usually not publicly accessible. GRPC API is supported by the drand client libraries, the `drand-client` CLI application and the [drand application](/operator/drand-cli/) itself (using `drand get public`).
