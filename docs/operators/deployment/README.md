---
title: Deploying a drand Network
sidebarDepth: 3
---

# Deploying a drand Network

This document explains in details the workflow to have a working group of drand
nodes generate randomness. On a high-level, the workflow looks like this:

- **Setup**: generation of individual long-term key pair and the group file and
  starting the drand daemon.
- **Distributed Key Generation**: each drand node collectively participates in
  the DKG.
- **Randomness Generation**: the randomness beacon automatically starts as soon
  as the DKG protocol is finished.

## Setup

The setup process for a drand node consists of the following steps:

1. Generate the long-term key pair for each node
2. Each node starts their daemon
3. Leader starts the command as a coordinator & every participant connect to the
   coordinator to setup the network

This document explains how to do the setup with the drand binary itself. drand also offers
a docker image to run the setup. You can find the information for running with docker
[here](https://github.com/drand/drand/blob/master/docker/README.md).

### Long-Term Key

To generate the long-term key pair `drand_id.{secret,public}` of the drand
daemon, execute

```
drand generate-keypair <address>
```

where `<address>` is the address from which your drand daemon is reachable. The
address must be reachable over a TLS connection directly or via a reverse proxy
setup. In case you need non-secured channel, you can pass the `--tls-disable`
flag.

### Starting drand daemon

The daemon does not go automatically in background, so you must run it with `&` in your terminal, within a screen / tmux session, or with the `-d` option
enabled for the docker commands. Once the daemon is running, the way to issue
commands to the daemon is to use the control functionalities. The control
client has to run on the same server as the drand daemon, so only drand
administrators can issue command to their drand daemons.

To choose where drand listens, use the `--private-listen` (and optionally
`--public-listen`) flags. These allow specifying the interface and/or port
for drand to listen on. `--private-listen` is the primary listener used
to expose a GRPC service for inter-group-member communication.
`--public-listen` exposes a public, limited HTTP service designed to be
CDN friendly and providing information for drand users.

There are two ways to run a drand daemon: using TLS or using plain old regular
unencrypted connections. Drand by default tries to use TLS connections.

#### With TLS

Drand nodes attempt to communicate by default over TLS-protected connections.
Therefore, you need to point your node to the TLS certificate chain and
corresponding private key you wish to use via:

```bash
drand start \
    --tls-cert <fullchain.pem> \
    --tls-key <privkey.pem>
```

To get TLS certificates for free you can use, for example, [Let's
Encrypt](https://letsencrypt.org/) with its official CLI tool [EFF's
certbot](https://certbot.eff.org/).

#### TLS setup: Nginx with Let's Encrypt

Running drand behind a reverse proxy is the **default** method of deploying
drand. Such a setup greatly simplifies TLS management issues (renewal of
certificates, etc). We provide here the minimum setup using
[Nginx](https://www.nginx.com/) and
[certbot](https://certbot.eff.org/instructions/) - make sure you have both
binaries installed with the latest version; Nginx version must be at least >=
1.13.10 for gRPC compatibility.

- First, add an entry in the Nginx configuration for drand:

```bash
# /etc/nginx/sites-available/default
server {
  server_name drand.nikkolasg.xyz;
  listen 443 ssl http2;

  location / {
    grpc_pass grpc://localhost:4444;
  }
  location /public/ {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
  }
  location /info {
    proxy_pass http://localhost:4444;
    proxy_set_header Host $host;
  }
  # Add ssl certificates by running certbot --nginx
}
```

**Note**: you can change

1. the port on which you want drand to be accessible by changing the line
   `listen 443 ssl http2` to use any port.
2. the port on which the drand binary will listen locally by changing the line
   `grpc_pass grpc://localhost:4444;` to the private API port and
   `proxy_pass http://localhost:8080;` to the public API port

You can use different `server` blocks to apply different configurations (DNS
names for example) for the private and public API.

- Run certbot to get a TLS certificate:

```bash
sudo certbot --nginx
```

- **Running** drand uses two ports: one for group member communication, and one for a public-facing API for distributing randomness. These ports, and interfaces should be specified with flags.

```bash
drand start --tls-disable --private-listen 127.0.0.1:4444 --public-listen 192.168.0.1:8080
```

The `--tls-disable` flag tells drand not to use TLS, because Nginx is providing TLS termination for us.

The `--private-listen` flag tells drand to listen for gRPC requests from other drand nodes on the given address. Note
that we're using the loopback address of `127.0.0.1`, which is not publicly accessible. When sharing the gRPC address
of your node with other nodes in the setup phase (see below), you must provide the public address that corresponds to
your node.

If no `private-listen` address is provided, it will default to the
discovered public address of the drand node.

The `--public-listen` flag tells drand to expose a public HTTP interface on the given address for clients to fetch
random values. If no `public-listen` flag is provided, drand will not expose a public HTTP interface.

#### TLS setup: Apache for HTTP

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

Note that this only forwards the HTTP requests for the public (client-facing) interface. The gRPC interface for
inter-node communication is not proxied.

#### Without TLS

Although we **do not recommend** it, you can always disable TLS in drand via:

```bash
drand start --tls-disable
```

If you're running without TLS, your [long-term key](#long-term-key) must also be created with the `--tls-disable` flag.

### Test the connection to a node

In order to test if your node is reachable from the internet and your setup is
correct, you can run the following command:

```
drand util check <address>
```

where address is the gRPC listen address as listed in the public key. If you disabled TLS,
you need to add the `--tls-disable` flag.

The `drand util check` command can also be used to test that other nodes are accessible, for example to ensure that
all participants are able to reach each other before entering the setup phase.

### Run the setup phase

To setup a new network, drand uses the notion of a coordinator that collects
the public keys of the participants, sets up the group configuration once all keys
are received, and then starts the distributed key generation phase. Once the DKG
phase is performed, the participants can see the list of members in the group
configuration file.

**Coordinator**: The designated coordinator node must run the following command
**before** everyone else:

```
drand share --leader --nodes 10 --threshold 6 --secret mysecret --period 30s
```

**Rest of participants**: Once the coordinator has run the previous command, the
rest of the participants must run the following command:

```
drand share --connect <leaderaddress> --secret mysecret
```

The flag usage is as follows:

- `--leader` indicates this node is a coordinator
- `--nodes` indicates how many nodes we expect to form the network
- `--threshold` indicates the threshold the network should use, i.e. how many
  nodes amongst the total needs to be online for the network to be live at any
  point.
- `--period` indicates the period of the randomness beacon to use. It must be
  valid duration as parsed by Golang's [`time.ParseDuration`](https://golang.org/pkg/time/#ParseDuration) method.
- `--secret` indicates the secret that the coordinator uses to authenticate the
  nodes that wants to participate in the network.
- `--connect` is the `host:port` address of the leader. By default, drand will
  connect to the leader by using tls. If you are not using tls, use the
  `--tls-disable` flag.

**Interactive command**: The command will run until the DKG protocol is complete.
If you quit the command, the `drand` daemon will continue the DKG, but the group file will not
be written down. In that case, once the DKG is done, you get the group file by
running:

```
drand show group --out group.toml
```

**Secret**: For participants to be included in the group, they need to have a
secret string shared by all. This method offers some basic security,
however drand will provide more manual checks later-on and/or different secrets
for each participants. However, since the set of participants is public and consistent
accross all participants after a setup, nodes can detect if there are some unwanted nodes
after the setup and in that case, setup a new network again.

**Custom entropy source**: By default drand takes its entropy for the setup
phase from the OS's entropy source (`/dev/urandom` on Unix systems). However,
it is possible for a participant to inject their own entropy source into the
creation of their secret. To do so, one must have an executable that produces
random data when called and pass the name of that executable to drand:

```
drand share <regular options> --source <entropy-exec>
```

where `<entropy-exec>` is the path to the executable which produces the user's
random data on STDOUT. As a precaution, the user's randomness is mixed by
default with `crypto/rand` to create a random stream. In order to introduce
reproducibility, the flag `user-source-only` can be set to impose that only the
user-specified entropy source is used. Its use should be limited to testing.

```
drand share <group-file> --source <entropy-exec> --user-source-only
```

## Distributed Key Generation

Once the DKG phase is done, each node has both a private share and a group file
containing the distributed public key. Using the previous commands shown, the
group file will be written to `group.toml`. That updated group file is needed by
drand to securely contact drand nodes on their public interface to gather
private or public randomness. A drand administrator can get the updated group
file via the following command:

```bash
drand show group
```

This will print the group file in its regular TOML format. If you want to save it
to a file, append the `--out <file>` flag.

## Randomness Generation

After a successful setup phase, drand will switch to the randomness generation
mode _at the genesis time_ specified in the group file.

At that time, each node broadcasts randomness shares at regular intervals. Every
new random beacon is linked to the previous one in a chain of randomness.
Once a node has collected a threshold of shares in the current round, it
computes the public random value and stores it in its local instance of
[BoltDB](https://github.com/etcd-io/bbolt).

**Chain Information**: More generally, for third party implementation of
randomness beacon verification, one only needs the distributed public key
generated during the setup phase, the period and the genesis time of the chain.

As an administrator of a drand node, you can use the control port to retrieve this
information using the following command:

```bash
drand show chain-info
```

A non-administrator can contact an external drand node to ask for its current
distributed public key by specifying an address:

```bash
drand get chain-info <address>
```

where `<address>` is the address of a drand node. Use the`--tls-cert` flag to
specify the server's certificate if needed. The group toml does not need to be
updated with the collective key.

**NOTE**: Using the last method (`get chain-info`), a drand node _can_ lie about the
key if no out-of-band verification is performed. That information is usually
best gathered from a trusted drand operator and then embedded in any
applications using drand.

**Timings of randomness generation**: At each new period, each node will try to
broadcast their partial signatures for the corresponding round and try to generate
a full randomness from the partial signatures. The corresponding round is the
number of rounds elapsed from the genesis time. That means there is a 1-1
mapping between a given time and a drand round.

**Daemon downtime & Chain Sync**: Due to the threshold nature of drand, a drand
network can support some number of nodes offline at any given point. This
number is determined by the threshold: `max_offline = group_len - threshold`.
When a drand node goes back up, it will sync rapidly with the other nodes to
catch up its local chain and participate in the next upcoming drand round.

**Drand network failure**: If for some reason drand goes down for some time and
then comes back up, the drand nodes will enter a "catchup phase," during which
they will produce random beacons for the rounds that were missed. During the
catchup phase, each node will broadcast partial signatures and collect them
into full random beacons as quickly as possible. This continues until they
reach the round corresponding to the current wall-clock time, at which point
the nodes leave the catchup phase and return to producing beacons at regular
intervals as usual.

## Control Functionalities

Drand's local administrator interface provides further functionality, e.g., to
update group details or retrieve secret information. By default, the daemon
listens on `127.0.0.1:8888`, but you can specify another control port when
starting the daemon with:

```bash
drand start --control 1234
```

In that case, you need to specify the control port for each of the following
commands.

### Long-Term Private Key

To retrieve the long-term private key of our node, run:

```bash
drand show private
```

### Long-Term Public Key

To retrieve the long-term public key of our node, run:

```bash
drand show public
```

### Private Key Share

To retrieve the private key share of our node, as determined during the DKG,
run the following command:

```bash
drand show share
```

The JSON-formatted output has the following form:

```json
{
  "index": 1,
  "share": {
    "gid": 22,
    "scalar": "764f6e3eecdc4aba8b2f0119e7b2fd8c35948bf2be3f87ebb5823150c6065764"
  }
}
```

The "gid" simply indicates which group of bls12-381 the data belongs to. It is present for
scalars and points on the curve, even though scalars are the same on the three
groups of bls12-381. The field is included to be able to accommodate different curves in the
future without modifying the JSON structure.

### Chain Information

To retrieve the information for the beacon chain this node participates in, run:

```bash
drand show chain-info
```

## Updating Drand Group

Drand allows for "semi-dynamic" group update with a _resharing_ protocol that
offers the following:

- new nodes can join an existing group and get new shares. Note that, in fact,
  all nodes get _new_ shares after running the resharing protocol.
- nodes can leave their current group. It may be necessary for nodes that do
  not wish to operate drand anymore.
- nodes can update the threshold associated with their current distributed
  public key.

The main advantage of this method is that the distributed public key stays the
_same_ even with new nodes coming in. That can be useful when the distributed
public key is embedded inside an application using drand, and hence is
difficult to update.

**Setting up the coordinator**: The coordinator must be a member of the current
network. To run the coordinator, run the following:

```
drand share --leader --transition --nodes 15 --threshold 10 --secret mysecret2 --out
group2.toml
```

This is similar to the procedure for the initial DKG, with the additional `--transition`
flag that indicates that we're resharing to a new group.

**Setting up the current members for the resharing**: The current members can
simply run the following command:

```
drand share --transition --nodes 15 --threshold 10 --secret mysecret2 --out
group2.toml
```

Unlike a fresh DKG, the members do not need to specify a `--connect <address>` flag,
as they can use the contact information from the current group configuration to
coordinate with the other nodes.

**Setting up the new members**: The new members need the current group file to
proceed. As mentioned in the [Distributed Key Generation section](#distributed-key-generation),
one of the current node operators can run `drand show group` to output the current
group file.

If the new member has the current group file written to `group.toml`, they can run the command:

```
drand share --from group.toml --nodes 15 --threshold 10 --secret mysecret2 --out
group2.toml
```

After the protocol is finished, each node will have the new group file written
out as `group2.toml`. The randomness generation starts only at the transition
time specified in the new group file.

## Metrics

The `--metrics <metrics-address>` flag may be used to launch a metrics server at
the provided address. The address may be specified as `127.0.0.1:port`, or as
`:port` to bind to the default network interface.

The web server at this port will serve [pprof](https://golang.org/pkg/net/http/pprof/)
runtime profiling data at `<metrics>/debug/pprof`, allow triggering golang
garbage collection at `<metrics>/debug/gc`, and will serve
[prometheus](https://prometheus.io/docs/guides/go-application/) metrics at
`<metrics>:/metrics`.

Prometheus counters track the number of gRPC requests sent and received by the drand node,
as well as the number of HTTP API requests. This **endpoint should not be exposed publicly**.
If desired, prometheus metrics can be used as a data source for [grafana
dashboards](https://grafana.com/docs/grafana/latest/features/datasources/prometheus/)
or other monitoring services.
