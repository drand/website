# Pubsub network

Drand is able to publish randomness on a [libp2p](https://libp2p.io) pubsub network using the [gossipsub protocol](https://docs.libp2p.io/concepts/publish-subscribe/), using what is known as a "gossip relay".

## Public endpoints

The public [League Of Entropy](https://blog.cloudflare.com/league-of-entropy/) network provides the following 1st-tier gossip relays (all existing gossip relays will form a mesh to distribute randomness around):

* `/dnsaddr/api.drand.sh`
* `/dnsaddr/api2.drand.sh`
* `/dnsaddr/api3.drand.sh`

The pubsub topic on which randomness is published is based to the drand's chain hash as follows:

```
/drand/pubsub/v0.0.0/<chain_hash>
```

for the public network being `/drand/pubsub/v0.0.0/8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce`.

## Usage

The published messages are encoded protobufs of type [`PublicRandResponse`](https://github.com/drand/drand/blob/799190bff8e1a2ce46dccfcf4e7f7d75075495b2/protobuf/drand/api.proto#L42-L53).

In order to receive randomness using this method you will to run an application that creates a libp2p host that can connect to a pubsub relay and subscribe to the pubsub topic. We recommend using drand's [client libraries](/developer/clients/) or the [drand-client](/developer/drand-client/) tool, which automatically perform *verification* for this task.

As a side note, IPFS can be used to subscribe to pubsub topics (running with `ipfs daemon --enable-pubsub-experiment`):

```sh
ipfs swarm connect /dnsaddr/api.drand.sh
ipfs pubsub sub /drand/pubsub/v0.0.0/8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce
```

(note that you will only see raw protobuf as the output though).
