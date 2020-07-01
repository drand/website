# HTTP API reference

Drand provides a JSON HTTP interface that clients can use to fetch randomness from the drand network. If you're using drand in an application, it may be easier and _more secure_ to use one of the [client libraries](/docs/client-libraries/), which will also perform _verification_ of randomness rounds and add additional features like failover, racing, aggregation, and caching.

All that's required is the address of the HTTP interface and way to fetch from HTTP, e.g. `curl`.

The public [League of Entropy](https://blog.cloudflare.com/league-of-entropy/) HTTP APIs are available at:

- [https://drand.cloudflare.com](https://drand.cloudflare.com)
- [https://drand.protocol.ai:8081](https://drand.protocol.ai:8081)
- [https://ln.soc1024.com:8888](https://ln.soc1024.com:8888)
- [https://drand.nikkolasg.xyz:4444](https://drand.nikkolasg.xyz:4444)
- [https://drand2.kudelskisecurity.com](https://drand2.kudelskisecurity.com)

The chain hash for the League of Entropy drand group is `TODO-LOE-CHAIN-HASH`

## `/info`

Retrieves the randomness chain information. It returns a JSON object with the following structure:

```json
{
  "public_key": "aaddd53d2c92454b698c52495990162bc999778a32fd570dad2ef3de2915a5b397d80ec5508919e84cd10944955b7318",
  "period": 10,
  "genesis_time": 1592226590,
  "hash": "c599c267a0dd386606f7d6132da8327d57e1004760897c9dd4fb8495c29942b2"
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
  "signature": "b62dd642e939191af1f9e15bef0f0b0e9562a5f570a12a231864afe468377e2a6424a92ccfc34ef1471cbd58c37c6b020cf75ce9446d2aa1252a090250b2b1441f8a2a0d22208dcc09332eaa0143c4a508be13de63978dbed273e3b9813130d5",
  "previous_signature": "afc545efb57f591dbdf833c339b3369f569566a93e49578db46b6586299422483b7a2d595814046e2847494b401650a0050981e716e531b6f4b620909c2bf1476fd82cf788a110becbc77e55746a7cccd47fb171e8ae2eea2a22fcc6a512486d",
  "randomness": "d7aed3686bf2be657e6d38c20999831308ee6244b68c8825676db580e7e3bec6"
}
```

- `round` is an sequentially increasing integer - the randomness round index
- `signature` is the _Boneh-Lynn-Shacham_ (BLS) signature for this round of randomness
- `previous_signature` is the signature of the previous round of randomness
- `randomness` is a SHA-512 hash of the signature

## `/public/{round}`

Retrieves a previous round of randomness identified by the positive integer `round`. Note that specifying `0` will retrieve the latest round. It returns a JSON object with the following structure:

```json
{
  "round": 367,
  "signature": "b62dd642e939191af1f9e15bef0f0b0e9562a5f570a12a231864afe468377e2a6424a92ccfc34ef1471cbd58c37c6b020cf75ce9446d2aa1252a090250b2b1441f8a2a0d22208dcc09332eaa0143c4a508be13de63978dbed273e3b9813130d5",
  "previous_signature": "afc545efb57f591dbdf833c339b3369f569566a93e49578db46b6586299422483b7a2d595814046e2847494b401650a0050981e716e531b6f4b620909c2bf1476fd82cf788a110becbc77e55746a7cccd47fb171e8ae2eea2a22fcc6a512486d",
  "randomness": "d7aed3686bf2be657e6d38c20999831308ee6244b68c8825676db580e7e3bec6"
}
```

- `round` is an sequentially increasing integer - the randomness round index
- `signature` is the _Boneh-Lynn-Shacham_ (BLS) signature for this round of randomness
- `previous_signature` is the signature of the previous round of randomness
- `randomness` is a SHA-512 hash of the signature
