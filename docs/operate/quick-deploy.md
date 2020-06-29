---
title: Quick deploy
description: Deploy three drand nodes quickly on your local network.
---

# Quick deploy

This guide walks you through spinning up three drand nodes on your local machine and connecting to the drand network.

## Set up your drand nodes

1. Create key-pairs for each of your nodes:

    ```bash
    drand generate-keypair --tls-disable --folder ~/.drand0 127.0.0.1:3000
    drand generate-keypair --tls-disable --folder ~/.drand1 127.0.0.1:3100
    drand generate-keypair --tls-disable --folder ~/.drand2 127.0.0.1:3200
    ```

    - `--tls-disable` disables TLS for all communications.
    - `--folder ~/.drand0` specifies where to keep all drand cryptographic information.
    - `127.0.0.1` and `3000` are the IP address and port of the drand service.

1. Start the daemons for each node:

    ```bash
    drand start --tls-disable --folder ~/.drand0 --private-listen 127.0.0.1:3000 --control 3001 --public-listen 127.0.0.1:3002
    drand start --tls-disable --folder ~/.drand1 --private-listen 127.0.0.1:3100 --control 3101 --public-listen 127.0.0.1:3102
    drand start --tls-disable --folder ~/.drand2 --private-listen 127.0.0.1:3200 --control 3201 --public-listen 127.0.0.1:3202
    ```

    - `--private-listen 127.0.0.1:3000` sets the listening (binding) address of the private API.
    - `--control 3001` sets the port you want to listen to for control port commands. If this isn't specified `8888` is used. Since we're running multiple local nodes, we have to specify different ports.
    - `--public-listen 127.0.0.1:3002` sets the listening (binding) address of the public API.

1. Set the first node as the _leader_:

    ```bash
    drand share --tls-disable --control 3001 --leader --nodes 3 --threshold 2 --secret mysecret --period 10s
    ```

    - `--leader` sets _this_ node as the leader of the group. Only one node can have this flag.
    - `--nodes` sets the number of nodes within this group.
    - `--threshold 2` sets the number of signatures each ndoe needs to collect when generating randomness.
    - `--secret` sets the _password_ that is used to access the group. All nodes within the group need to know this secret.
    - `--period 10s` specifies how often a randomness round will be issued.

1. Set the other two nodes as _participants_:

    ```bash
    drand share --tls-disable --control 3101 --connect 127.0.0.1:3000 --nodes 3 --threshold 2 --secret mysecret
    drand share --tls-disable --control 3201 --connect 127.0.0.1:3000 --nodes 3 --threshold 2 --secret mysecret
    ```

That's the set up done!

## Gossip relay

You need to have `jq` installed to run this section:

```bash
sudo apt install jq
```

You'll also need to drand-gossip-relay binary built, and added to your path.

<!-- TODO: What is the gossip relay? What does it do? Is it a built in function within drand, or something that already exists on the internet? -->

```sh
# GRPC
go run ./main.go run -hash=$(curl http://127.0.0.1:3002/info -s | jq -r .hash) -grpc-connect=127.0.0.1:3000 -insecure

# HTTP
go run ./main.go run -hash=$(curl http://127.0.0.1:3002/info -s | jq -r .hash) -url=http://127.0.0.1:3002
```

## Gossip client

<!-- TODO: what is a gossip client? How does it relate to the gossip relay? -->

```sh
go run ./main.go -chain-hash=$(curl http://127.0.0.1:3002/info -s | jq -r .hash) client -peer-with=/ip4/127.0.0.1/tcp/44544/p2p/12D3KooWBHSzkTUCVrkSaND1PmayysgHA5QK2DA73u3AfzTk14uP -http-failover=http://127.0.0.1:3002 -http-failover-grace=1s
```

<!-- TODO: does the user have to run both these lines, or just one? -->

## Relay combinations

<!-- What do these things do? -->

```sh
go run ./main.go run -relay=/ip4/192.168.1.157/tcp/44545/p2p/12D3KooWCgyz1gZWa6yd3CoeC5d7n2qRG4Q2VBWJZUgFUpTgjMAX \
                     -relay=/ip4/192.168.1.157/tcp/44544/p2p/12D3KooWBHSzkTUCVrkSaND1PmayysgHA5QK2DA73u3AfzTk14uP \
                     -group-conf=/Users/johnny/.drand0/groups/drand_group.toml \
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
                     -listen=/ip4/0.0.0.0/tcp/44546 \
                     -failover-grace=5s
```
