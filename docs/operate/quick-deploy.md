---
title: Quick deploy
description: Deploy three drand nodes quickly on your local network.
---

# Quick deploy

This guide walks you through spinning up three drand nodes on your local machine and connecting to the drand network.

## Set up your drand nodes

1. First up we need to create key-pairs for each of your nodes:

    ```bash
    drand generate-keypair --tls-disable --folder ~/.drand0 127.0.0.1:3000
    drand generate-keypair --tls-disable --folder ~/.drand1 127.0.0.1:3100
    drand generate-keypair --tls-disable --folder ~/.drand2 127.0.0.1:3200
    ```

    <!-- TODO: what does --tls-disable do? -->
    <!-- TODO: what does folder do? -->
    <!-- TODO: assuming ~/.drand0 is the save location, 127.0.0.1 is the server IP, and :3000 is the port number.  -->

1. Start the daemons for each node:

    ```bash
    drand start --tls-disable --folder ~/.drand0 --private-listen 127.0.0.1:3000 --control 3001 --public-listen 127.0.0.1:3002
    drand start --tls-disable --folder ~/.drand1 --private-listen 127.0.0.1:3100 --control 3101 --public-listen 127.0.0.1:3102
    drand start --tls-disable --folder ~/.drand2 --private-listen 127.0.0.1:3200 --control 3201 --public-listen 127.0.0.1:3202
    ```

    <!-- TODO: what does --private-listen 127.0.0.1:3000 do? Listen for public randomness here maybe? -->
    <!-- TODO: what does --control 3001 do? Some kind of remote control access port? -->
    <!-- TODO: what does --public-listen 127.0.0.1:3002 do? Listen for private randomness here maybe? -->

1. Set the first node as the _leader_:

    ```bash
    drand share --tls-disable --control 3001 --leader --nodes 3 --threshold 2 --secret mysecret --period 10s
    ```

    <!-- TODO: what does --period do? -->

1. Set the other two nodes as _participants_:

    ```bash
    drand share --tls-disable --control 3101 --connect 127.0.0.1:3000 --nodes 3 --threshold 2 --secret mysecret
    drand share --tls-disable --control 3201 --connect 127.0.0.1:3000 --nodes 3 --threshold 2 --secret mysecret
    ```

That's the set up done!

## Gossip relay

<!-- TODO: What is the gossip relay? What does it do? Is it a built in function within drand, or something that already exists on the internet? -->

```sh
# GRPC
go run ./main.go -chain-hash=$(curl http://127.0.0.1:3002/info -s | jq -r .hash) run -grpc-connect=127.0.0.1:3000 -insecure

# HTTP
go run ./main.go -chain-hash=$(curl http://127.0.0.1:3002/info -s | jq -r .hash) run -http-connect=http://127.0.0.1:3002
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
