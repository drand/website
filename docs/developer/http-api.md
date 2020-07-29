# HTTP API reference

Drand provides a JSON HTTP interface that clients can use to fetch randomness from the drand network. If you're using drand in an application, it may be easier and _more secure_ to use one of the [client libraries](/developer/clients/), which will also perform _verification_ of randomness rounds and add additional features like failover, racing, aggregation, and caching.

All that's required is the address of the HTTP interface and way to fetch from HTTP, e.g. `curl`.

## Public endpoints

The public [League of Entropy](https://blog.cloudflare.com/league-of-entropy/) HTTP APIs are available at:

- Protocol Labs
    - [https://api.drand.sh](https://api.drand.sh)
    - [https://api2.drand.sh](https://api2.drand.sh)
    - [https://api3.drand.sh](https://api3.drand.sh)
- Cloudflare
    - [https://drand.cloudflare.com](https://drand.cloudflare.com)

The chain hash for the League of Entropy drand group is:

```
8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce
```

## `/info`

Retrieves the randomness chain information. It returns a JSON object with the following structure:

```json
{
  "public_key": "868f005eb8e6e4ca0a47c8a77ceaa5309a47978a7c71bc5cce96366b5d7a569937c529eeda66c7293784a9402801af31",
  "period": 30,
  "genesis_time": 1595431050,
  "hash": "8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce"
}
```

- `public_key` is the distributed public key of the drand group
- `period` is the time in seconds between randomness beacon rounds
- `genesis_time` is the time in seconds since the Unix Epoch that the group began generating randomness
- `hash` is the _chain hash_, which uniquely identifies the drand chain. It is used as a root of trust for validation of the first round of randomness.

## `/public/latest`

Retrives the latest round of randomness. It returns a JSON object with the following structure:

```json
{
  "round": 367,
  "randomness": "3439d92d58e47d342131d446a3abe264396dd264717897af30525c98408c834f",
  "signature": "90957ebc0719f8bfb67640aff8ca219bf9f2c5240e60a8711c968d93370d38f87b38ed234a8c63863eb81f234efce55b047478848c0de025527b3d3476dfe860632c1b799550de50a6b9540463e9fb66c8016b89c04a9f52dabdc988e69463c1",
  "previous_signature": "859504eade86790ad09b2b3474d5e09d1718b549ef7107d7bbd18f5e221765ce8252d7db02664c1f6b20f40c6e8e138704d2acfeb6c5abcc14c77e3a842b2f84515e7366248ca37b1460d23b4f98493c246fbb02851f2a43a710c968a349f8d6"
}
```

- `round` is an sequentially increasing integer - the randomness round index
- `randomness` is a SHA-512 hash of the signature
- `signature` is the _Boneh-Lynn-Shacham_ (BLS) signature for this round of randomness
- `previous_signature` is the signature of the previous round of randomness

## `/public/{round}`

Retrieves a previous round of randomness identified by the positive integer `round`. Note that specifying `0` will retrieve the latest round. It returns a JSON object with the following structure:

```json
{
  "round": 367,
  "randomness": "3439d92d58e47d342131d446a3abe264396dd264717897af30525c98408c834f",
  "signature": "90957ebc0719f8bfb67640aff8ca219bf9f2c5240e60a8711c968d93370d38f87b38ed234a8c63863eb81f234efce55b047478848c0de025527b3d3476dfe860632c1b799550de50a6b9540463e9fb66c8016b89c04a9f52dabdc988e69463c1",
  "previous_signature": "859504eade86790ad09b2b3474d5e09d1718b549ef7107d7bbd18f5e221765ce8252d7db02664c1f6b20f40c6e8e138704d2acfeb6c5abcc14c77e3a842b2f84515e7366248ca37b1460d23b4f98493c246fbb02851f2a43a710c968a349f8d6"
}
```

- `round` is an sequentially increasing integer - the randomness round index
- `randomness` is a SHA-512 hash of the signature
- `signature` is the _Boneh-Lynn-Shacham_ (BLS) signature for this round of randomness
- `previous_signature` is the signature of the previous round of randomness
