---
title: Local deploy
description: If you want to test things out before deploying to production servers, follow this guide to deploy three drand nodes quickly on your local machine.
---

# Local deploy

If you want to test things out before deploying to production servers, follow this guide to deploy three drand nodes quickly on your local machine.

## Set up your drand nodes

1. Create key-pairs for each of your nodes:

    ```bash
    drand generate-keypair --tls-disable --folder ~/.drand0 127.0.0.1:3000
    drand generate-keypair --tls-disable --folder ~/.drand1 127.0.0.1:3100
    drand generate-keypair --tls-disable --folder ~/.drand2 127.0.0.1:3200
    ```

    | Flag | Description |
    | ---- | ----------- |
    | `--tls-disable` | Disables TLS for all communications. |
    | `--folder ~/.drand0` | Specifies where to keep all drand cryptographic information. |
    | `127.0.0.1` | The IP address of the drand service. |
    | `:3000` | The port of the drand service |

1. Start the daemons for each node:

    ```bash
    drand start --tls-disable --folder ~/.drand0 --private-listen 127.0.0.1:3000 --control 3001 --public-listen 127.0.0.1:3002
    drand start --tls-disable --folder ~/.drand1 --private-listen 127.0.0.1:3100 --control 3101 --public-listen 127.0.0.1:3102
    drand start --tls-disable --folder ~/.drand2 --private-listen 127.0.0.1:3200 --control 3201 --public-listen 127.0.0.1:3202
    ```

    | Flag | Description |
    | ---- | ----------- |
    | `--private-listen 127.0.0.1:3000` | Sets the listening (binding) address of the private API. |
    | `--control 3001` | Sets the port you want to listen to for control port commands. If this isn't specified `8888` is used. Since we're running multiple local nodes, we have to specify different ports. |
    | `--public-listen 127.0.0.1:3002` | Sets the listening (binding) address of the public API. |

1. Set the first node as the _leader_:

    ```bash
    drand share --tls-disable --control 3001 --leader --nodes 3 --threshold 2 --secret mysecret --period 10s
    ```

    | Flag | Description |
    | ---- | ----------- |
    | `--leader` | Sets _this_ node as the leader of the group. Only one node can have this flag. |
    | `--nodes` | Sets the number of nodes within this group. |
    | `--threshold 2` | Sets the number of signatures each ndoe needs to collect when generating randomness. |
    | `--secret` | Sets the _password_ that is used to access the group. All nodes within the group need to know this secret. |
    | `--period 10s` | Specifies how often a randomness round will be issued. |

1. Set the other two nodes as _participants_:

    ```bash
    drand share --tls-disable --control 3101 --connect 127.0.0.1:3000 --nodes 3 --threshold 2 --secret mysecret
    drand share --tls-disable --control 3201 --connect 127.0.0.1:3000 --nodes 3 --threshold 2 --secret mysecret
    ```

That's the set up done!

## Gossip relay

The drand gossip relay is a program that relays drand randomness rounds over libp2p pubsub (known as _gossipsub_) from a gRPC, HTTP, or gossipsub source.

1. Build the Drand Gossip Relay binary:

    ```bash
    git clone https://github.com/drand/drand.git
    cd drand
    make relay-gossip
    ```

    This outputs a `drand-relay-gossip` executable to the current directory.

1. Move `drand-relay-gossip` somewhere handy and add it to your path. If your `drand` executable is stored in `~/drand` you can move the `drand-relay-gossip` executable within the same folder:

    ```bash
    mv drand-relay-gossip drand
    ```

1. Start a drand gossip relay process either using GRPC **or** HTTP:

    ```bash
    # GRPC
    drand-relay-gossip run -hash=$(curl http://127.0.0.1:3002/info -s | jq -r .hash) -grpc-connect=127.0.0.1:3000 -insecure

    # HTTP
    drand-relay-gossip run -hash=$(curl http://127.0.0.1:3002/info -s | jq -r .hash) -url=http://127.0.0.1:3002
    ```

1. That's the drand gossip relay set up!

## Gossip client

<!-- TODO: what is a gossip client? How does it relate to the gossip relay? -->

```sh
go run ./main.go -chain-hash=$(curl http://127.0.0.1:3002/info -s | jq -r .hash) client -peer-with=/ip4/127.0.0.1/tcp/44544/p2p/12D3KooWBHSzkTUCVrkSaND1PmayysgHA5QK2DA73u3AfzTk14uP -http-failover=http://127.0.0.1:3002 -http-failover-grace=1s
```

## Relay combinations

<!-- What do these things do? -->

```sh
go run ./main.go run -relay=/ip4/192.168.1.157/tcp/44545/p2p/12D3KooWCgyz1gZWa6yd3CoeC5d7n2qRG4Q2VBWJZUgFUpTgjMAX \
                     -relay=/ip4/192.168.1.157/tcp/44544/p2p/12D3KooWBHSzkTUCVrkSaND1PmayysgHA5QK2DA73u3AfzTk14uP \
                     -group-conf=/Users/alan/.drand0/groups/drand_group.toml \
                     -store=./datastore3 \
                     -identity=identity3.key \
                     -listen=/ip4/0.0.0.0/tcp/44546

go run ./main.go run -relay=/ip4/192.168.1.157/tcp/44545/p2p/12D3KooWCgyz1gZWa6yd3CoeC5d7n2qRG4Q2VBWJZUgFUpTgjMAX \
                     -relay=/ip4/192.168.1.157/tcp/44544/p2p/12D3KooWBHSzkTUCVrkSaND1PmayysgHA5QK2DA73u3AfzTk14uP \
                     -url=http://127.0.0.1:3002 \
                     -hash=a8afe4a8793cc87e6df6389a051a4aa7a6c4f88198da858bead2e2d5314d5e27 \
                     -store=./datastore3 \
                     -identity=identity3.key \
                     -listen=/ip4/0.0.0.0/tcp/44546

go run ./main.go run -relay=/ip4/127.0.0.1/tcp/44544/p2p/12D3KooWPTqaFVH7DnsHtu4JFf7ZPoXQ6p8ngvrG2y1h1nzzhWwK \
                     -relay=/ip4/127.0.0.1/tcp/44545/p2p/12D3KooWKzGNUYstihJQNXuj9GWLGrgHPkLsEkNGizLBYcqUrja8 \
                     -url=http://127.0.0.1:3002 \
                     -hash=a8afe4a8793cc87e6df6389a051a4aa7a6c4f88198da858bead2e2d5314d5e27 \
                     -store=./datastore3 \
                     -identity=identity3.key \
                     -listen=/ip4/0.0.0.0/tcp/44546
```

<!-- https://gist.github.com/alanshaw/8d88db67a5880a2bf9e50f5cebe74bb8 -->