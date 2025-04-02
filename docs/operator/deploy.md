---
title: Deployment
description: Learn how to deploy a drand node onto your network.
sidebarDepth: 2
---

# Deployment guide

This document explains the workflow to have a working group of drand nodes generate randomness. There are four sections to this guide:

1. Start the daemons.
2. Choose a beacon id.
3. Generate the long-term key pairs and the group file.
4. Have each node collectively participate in the distributed key generation (DKG).
5. Generate randomness.

**You can repeat these steps every time you want to start a new network for randomness generation. If the drand daemon is already running, please
skip that step. For each new network, a unique identifier, known as `Beacon ID` is required.** 

## Setup

The setup process for a drand node consists of the following steps:

1. Start the drand daemon on each node.
2. Choose a beacon id for the new network.
3. Generate the long-term key pair for each new network.
4. The leader starts the command as a coordinator & every participant connects to the coordinator to setup the network.

This document explains how to do the setup with the drand binary itself. If you want to install drand using Docker, follow the [Docker instructions instead](/operator/docker/).


### Beacon ID 

Each drand network needs a **unique identifier** to run. The only constraint regarding possible values is it could not have been used before on another network. If you leave the id empty, the node will
set it to `default`.

### Long-term key

Each drand network needs a public and secret key to interact with the rest of the nodes. To generate these keys run [`drand generate-keypair`](/operator/drand-cli/#drand-generate-keypair) followed by the address of your node:

```bash
drand generate-keypair --id {beacon-id} drand.example.com
```

The address must be reachable via a reverse proxy setup performing TLS termination. (Disabling TLS is only done when running in development mode or for test deployment, using tags.)

The default location for your keys is `~/.drand`. You can specify where you want the keys to be saved by using the `--folder` flag:

```bash
drand generate-keypair --id {beacon-id} drand0.example.com --folder ~/.drand-node-0
```

### Starting drand daemon

The daemon does not automatically run in the background. To run the daemon in the background, you must add ` &` to the end of your command. Docker users can use the `-d` option. Once the daemon is running, the best way to issue commands is to use the control functionalities. The control client has to run on the same server as the drand daemon, so only drand administrators can issue a command to their drand daemons.

To choose where drand listens, use the `--private-listen` flag. You can also use the `--public-listen` flag to specify the address of the public API. Both these flags allow specifying the interface and/or port for drand to listen on. The `--private-listen` flag is the primary listener used to expose a gRPC service for inter-group-member communication. The `--public-listen` flag exposes a public and limited HTTP service designed to be CDN friendly, and provide basic information for drand users.

The drand daemon should be behind a reverse proxy doing TLS termination.

#### More about TLS

Running drand behind a reverse proxy is the **only** method of deploying drand. Such a setup greatly simplifies TLS management issues (renewal of certificates, etc.). We provide here the minimum setup using [Nginx](https://www.nginx.com/) and [certbot](https://certbot.eff.org/instructions/) - make sure you have both binaries installed with the latest version; Nginx version must be at least >= `1.13.10` for gRPC compatibility.

For example if your public address and port are `drand.example.com:4321`, then the key generation above should use this address, but the node should use another port to listen on for the decrypted content from
the reverse proxy (nginx). For example if the reverse proxy is running on the same machine and forwarding to port 8080, then you'd start your drand node like this:
```bash
drand start --private-listen 127.0.0.1:8080
```


1. First, add an entry in the Nginx configuration for drand:

    ```nginx
    # /etc/nginx/sites-available/default
    server {
        server_name drand.example.xyz;
        listen 443 ssl http2;

        location / {
            # Check for gRPC header
            if ($http_content_type = "application/grpc") {
                grpc_pass grpc://localhost:4444;
                grpc_set_header X-Real-IP $remote_addr;
            }

            # If not gRPC, treat as regular HTTP
            proxy_pass http://localhost:8080;
            proxy_set_header Host $host;
        }

    # Add ssl certificates by running certbot --nginx
    }
    ```

    You can change:

    1. the port on which you want drand to be accessible by changing the line `listen 443 ssl http2` to use any port.
    2. the port on which the drand binary will listen locally by changing the line `grpc_pass grpc://localhost:4444;` to the private API port and `proxy_pass http://localhost:8080;` to the public API port.

    You can use different `server` blocks to apply different configurations (DNS names, for example) for the private and public API.

1. Run certbot to get a TLS certificate:

    ```bash
    sudo certbot --nginx
    ```

1. Running drand uses two ports: one for group member communication, and one for a public-facing API for distributing randomness. These ports and interfaces should be specified with flags.

    ```bash
    drand start --private-listen 127.0.0.1:4444 --public-listen drand0.example.com:8080
    ```

    The `--private-listen` flag tells drand to listen on the given address. The public-facing address associated with this listener is given to other group members in the setup phase (see below).

    If no `private-listen` address is provided, it will default to the discovered public address of the drand node.

    If no `public-listen` flag is provided, drand will not expose a public HTTP interface.

##### TLS setup: Apache for HTTP

The equivalent Apache config block to the NGinX config above for forwarding HTTP requests back to the drand public port would be:

```apache
ProxyPreserveHost On
SSLProxyEngine on
SSLProxyCheckPeerCN off
ProxyPass / https://127.0.0.1:8080/
ProxyPassReverse / https://127.0.0.1:8080/
<Proxy *>
allow from all
</Proxy>
```

### Test the connection to a node

Use `drand util check <address>` to test the gRPC endpoint on a drand node (like a ping to the node).

```bash
drand util check drand.example.com:443

> drand: id drand.example.com:443 answers correctly
```

If the address used is a DNS name, this command will try to resolve the DNS name to IP.

### Test the connection to a network

Use `drand util check <address> --id <beacon-id>` to test the gRPC endpoint of a drand network which has a specific beacon id.

```bash
drand util check drand.example.com:443 --id <beacon-id>

> drand: id drand.example.com:443 answers correctly
```

### Run the setup phase

To setup a new network, drand uses the notion of a coordinator that collects the public key of the participants, setups the group configuration once all keys are received, and then start the distributed key generation phase. Once the DKG phase is performed, the participants can see the list of members in the group configuration file.

**Coordinator**: The designated coordinator node must run the following command
**before** everyone else:

```bash
drand share --leader --nodes 10 --threshold 6 --secret-file /path/to/secret/file --period 30s --id {beacon-id} --scheme {scheme-id}
```

**Rest of participants**: Once the coordinator has run the previous command, the rest of the participants must run the following command:

```bash
drand share --connect <leaderaddress> --secret-file /path/to/secret/file --id {beacon-id}
```

The flags usage is as follows:

| Flag               | Description                                                                                                                                                              |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--leader`         | _This_ node is the group coordinator.                                                                                                                                    |
| `--nodes`          | The number of nodes in this group.                                                                                                                                       |
| `--threshold`      | The minimum number of nodes that need to be online for the network to be live.                                                                                           |
| `--period`         | The period of the randomness beacon to use. It must be a valid duration as parsed by Golang's [`time.ParseDuration`](https://golang.org/pkg/time/#ParseDuration) method. |
| `--catchup-period` | The period of randomness when recovering from a failure. A valid Golang duration, it may be 0 to catch up as fast as possible.                                           |
| `--secret-file`    | The file that contains the password that the leader uses to authenticate nodes that want to participate in the group. This password must be at least 32 characters long. This variable contains the path and name of the file. Notice that this flag takes precedence over the `DRAND_SHARE_SECRET` env variable if set.      |
| `--id`             | The unique identification for this new network. It allows drand to handle various networks running at the same time.                                                     |
| `--scheme`         | The scheme the new network will use. It allows the network to work on chain or unchained mode.      |

The `drand share` command will run until the DKG has finished. If you quit the command, the DKG will continue, but the group file will not be created. In that case, once the DKG is done, you can get the group file by running:

```bash
drand show group --out group.toml --id {beacon-id}
```

If you specified a `--control` in when you started the drand node, you will have to supply the same port with this command:

```bash
drand show group --out group.toml --control 3001 --id {beacon-id}
```

#### Secret

As a basic security method, participants must include a shared secret before they can be accepted into a group. This secret is set by the leader. The secret must be at least 32 characters long. If the `DRAND_SHARE_SECRET` environment variable is set on your system, the command line flag can be omitted.

#### Custom entropy source

drand takes its entropy for the setup phase from the OS's entropy source by default. This source is `/dev/urandom` on Unix systems. However, it is possible for a participant to inject their own entropy source into the creation of their secret.

You should be able to rely on [`rngd`](https://linux.die.net/man/8/rngd) to feed your custom entropy source into your OS kernel, and thus into `drand`.

### Group TOML file

Once the DKG phase is done, each node has both a private share and a group file containing the distributed public key. Using the previous commands, the group file will be written to `group.toml`. That updated group file is needed by drand to securely contact drand nodes on their public interface to gather private or public randomness. To view this file, run `drand show group`. If you want to save the output to a file, add the `--out <file>` flag:

```bash
drand show group --out ~/group-config.toml --id {beacon-id}
```

## Randomness Generation

After a successful setup phase, drand will switch to the randomness generation mode _at the genesis time_ specified in the group file. Each node broadcasts _randomness shares_ at regular intervals. Every new random beacon is linked to the previous one in a chain of randomness. Once a node has collected a threshold of shares in the current round, it computes the public, random value, and stores it in its local instance of [BoltDB](https://github.com/coreos/bbolt).

For third party implementations of randomness beacon verification, you need:

- The distributed public key generated during the setup phase.
- The period.
- The genesis time of the chain.

As an administrator of a drand node, you can use the control port to access a series of important information:

- For listing all running networks:
```bash
drand util status --list-ids
```

- For accessing the chain information of a network:

```bash
drand show chain-info --id {beacon-id}
```

### Timings

At each new period, each node will try to broadcast their partial signatures for the corresponding round and try to generate full randomness from the partial signatures. The corresponding round is the number of rounds elapsed from the genesis time. That means there is a 1-1 mapping between a given time and a drand round.

### Daemon downtime and chain sync

Due to the threshold nature of drand, a drand network can support some numbers of nodes offline at any given point. This number is determined by the threshold: `max_offline = group_len - threshold`. When a drand node goes back up, it will sync rapidly with the other nodes to catch up its local chain and participate in the next upcoming drand round.

### drand network failure

If, for some reason, drand goes down for some time and then backs up, the new random beacon will be built over the _last successfully generated beacon_. For example, if the network goes down at round `10` (i.e., the last beacon generated contained `round: 10`), and back up again at round `20` (i.e., field `round: 20`), then this new randomness contains the field `previous_round:10`.

## Control functionalities

drand's local administrator interface provides further functionality, e.g., to update group details or retrieve secret information. By default, the daemon listens on `127.0.0.1:8888`, but you can specify another control port when starting the daemon with:

```bash
drand start --control 1234
```

In that case, you need to specify the control port for each of the following commands.

### Long-term public key

To retrieve the long-term public key of our node, run:

```bash
drand show public --id {beacon-id}
```

### Chain information

To retrieve information about the chain this node participates in, run:

```bash
drand show chain-info --id {beacon-id}
```

## Updating drand group

drand allows for "semi-dynamic" group update with a _resharing_ protocol that offers the following:

- New nodes can join an existing group and get new shares. Note that, in fact, all nodes get _new_ shares after running the resharing protocol.
- Nodes can leave their current group. It may be necessary for nodes that do not wish to operate drand anymore.
- Nodes can update the threshold associated with their current distributed public key.
- refresh the shares (similar to using a new private key)

The main advantage of this method is that the distributed public key stays the _same_ even with new nodes coming in. That can be useful when the distributed public key is embedded inside the application using drand, and hence is difficult to update.

**Setting up the new members**: The new members need the current group file to proceed. Check how to get the group file in the [Deployment](https://beta.drand.love/operator/deploy/#group-toml-file) section.

:::tip
A new member will need the full history of randomness beacons to participate in a group so that the new node can field requests for previous rounds.
Getting the full history can take a while, you can also ask an existing member for a copy of their database to speed things up and reduce bandwidth usage.
:::

A new member can synchronize with a chain before joining. This can be done by anyone that is allowlisted by the other nodes, and does not require resharing to have started.

```bash
drand follow --sync-nodes <coordinator> --chain-hash <chain hash>
```

This command will not exit, but will keep adding new beacons to the local database as they are produced.
If you wish for the command to terminate once it has synchronized up to _now_, you can add the option `--up-to=<round>` where `round` is the current randomness round.

After the resharing protocol is finished, each node will have the new group file written out as `.drand/multibeacon/<beaconid>/groups/group.toml`. The randomness generation starts only at the specified transition time specified in the new group file.

## Metrics

The `--metrics <metrics-address>` flag may be used to launch a metrics server at the provided address. The address may be specified as `127.0.0.1:port`, or as `:port` to bind to the default network interface. The webserver at this port will serve [pprof](https://golang.org/pkg/net/http/pprof/) runtime profiling data at `<metrics>/debug/pprof`, allow triggering golang garbage collection at `<metrics>/debug/gc`, and will serve [prometheus](https://prometheus.io/docs/guides/go-application/) metrics at `<metrics>:/metrics`. Prometheus counters track the number of gRPC requests sent and received by the drand node, as well as the number of HTTP API requests. This endpoint should not be exposed publicly. If desired, prometheus metrics can be used as a data source for [grafana dashboards](https://grafana.com/docs/grafana/latest/features/datasources/prometheus/) or other monitoring services.
