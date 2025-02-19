---
title: 'API and client library documentation'
---

# Developer

This section helps developers build applications that use drand as a source of randomness. For help running your own drand network, see the [Operator's Guide](/operator/).

The current public League of Entropy drand mainnet API endpoints are:

* `https://api.drand.sh/v2` (HTTPS endpoint, also available over HTTP)
* `https://api2.drand.sh/v2` (HTTPS endpoint, also available over HTTP)
* `https://api3.drand.sh/v2` (HTTPS endpoint, also available over HTTP)
* `https://drand.cloudflare.com` (HTTPS endpoint)
* `https://api.drand.secureweb3.com:6875` (HTTPS endpoint)
* `/dnsaddr/api.drand.sh` (1st-level libp2p gossipsub relay endpoint)
* `/dnsaddr/api2.drand.sh` (1st-level libp2p gossipsub relay endpoint)
* `/dnsaddr/api3.drand.sh` (1st-level libp2p gossipsub relay endpoint)

There are three networks on mainnet:
- `default` which is running the chained scheme with public keys on G1 of the BLS12-381 curve
- `quicknet` which is running the unchained scheme with public keys on G2 of the BLS12-381 curve
- `evmnet` which is runnong the unchained scheme with public keys on G2 of the BN254 curve

`default` network chain hash:
```8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce```

`quicknet` network chain hash:
```52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971```

`evmnet` network chain hash:
```04f1e9062b8a81f848fded9c12306733282b2727ecced50032187751166ec8c3```

Note that [the `fastnet` network has been deprecated](/blog/2023/07/03/fastnet-sunset-quicknet-new/).

In order to retrieve randomness from a drand network you should **preferentially use the [drand client libraries](/developer/clients/), which support the different mechanisms and perform verification for every value obtained.

Alternatively, you can interact directly with the endpoints. Make sure to manually verify every value:

- [HTTP API reference](/developer/http-api/)
- [Pubsub-based randomness distribution](/developer/gossipsub/)
- gRPC API: usually not publicly accessible except by the drand daemon and HTTP/GossipSub relays.

Finally, for development purposes, we recommend also testing your code against our Testnet endpoints.
See [our dedicated documentation entry about testnet endpoints](/developer/http-api/#testnet-endpoints).
