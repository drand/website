---
title: Drand Command Line Tools
sidebarDepth: 2
---

# Drand Command Line Tools

Drand's main functionality is provided by the `drand` program, which allows you to run a Drand server and control its operation. You can also
use `drand` as a client to fetch randomness from a Drand network.

See the [Supplemental Tools](#supplemental-tools) for some other helpful tools for scaling Drand, as well as a standalone client for consuming
randomness.

## Installing `drand`

### Binary Releases

The simplest way to get `drand` is to [download a pre-built binary release](https://github.com/drand/drand/releases) for your platform.

You can verify the checksum of a `drand` binary release by checking the `checksums.txt` listed in the GitHub assets for the release, which
contains the SHA-256 checsum for each release archive. To check your local download, you can use the `shasum` command:

```
shasum -a 256 <path-to-drand.tar.gz>
```

### Source Code

You can compile `drand` from source code by cloning the [drand GitHub repository](https://github.com/drand/drand) and building the project.

This will require a working [Golang installation](https://golang.org/doc/install), and your
[GOPATH](https://golang.org/doc/code.html#GOPATH) must be set. You'll also need the `make` command available.

With those requirements met, install drand via:

```bash
git clone https://github.com/drand/drand
cd drand
make install
```

This will install `drand` into `$GOPATH/bin`, which should be on your `$PATH` if you followed the standard Go install instructions.

If you'd prefer not to install `drand` globally, or if you want to put the `drand` binary in a different location, you can run `make build` instead
of `make install`. This will create the `drand` binary in the current directory.

## Usage

This section gives a basic overview of the main `drand` CLI interface to give an idea of the options available.
If you're setting up a Drand network deployment, please see the [Deployment Guide](./deploy.md), which walks through
using `drand` to run a live network.

The `drand` command has several subcommands. Among the most important is `drand help`, which will introduce you to
the rest of the subcommands:

```
$ drand help

NAME:
   drand - distributed randomness service

USAGE:
   drand [global options] command [command options] [arguments...]

VERSION:
   0.9.1

COMMANDS:
   start  Start the drand daemon.
   stop   Stop the drand daemon.

   share             Launch a sharing protocol.
   generate-keypair  Generate the longterm keypair (drand.private, drand.public)for this node.

   get  get allows for public information retrieval from a remote drand node.

   util  Multiple commands of utility functions, such as reseting a state, checking the connection of a peer...
   show  local information retrieval about the node's cryptographic material. Show prints the information about the collective public key (drand.cokey), the group details (group.toml), the long-term private key (drand.private), the long-term public key (drand.public), or the private key share (drand.share), respectively.

   help, h  Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --verbose       If set, verbosity is at the debug level (default: false)
   --folder value  Folder to keep all drand cryptographic information, with absolute path. (default: "/home/yusef/.drand")
   --help, -h      show help (default: false)
   --version, -v   print the version (default: false)
```

The `help` command can be used for subcommands as well, for example `drand help generate-keypair`. If you prefer, you can
also show help with the `--help` flag after the subcommand name, e.g.: `drand generate-keypair --help`.

### `drand generate-keypair`

The `generate-keypair` command creates a long-term public/private keypair for a drand node. It should
be run before starting the node, and you must provide the address that your Drand
node will listen on, including the publicly reachable port number. This may be different than the port specified
when starting the daemon, for example if you've set up `drand` to run behind a reverse proxy as described in
the [Deployment Guide](./deploy/).

```
$ drand help generate-keypair

NAME:
   drand generate-keypair - Generate the longterm keypair (drand.private, drand.public)for this node.


USAGE:
   drand generate-keypair [command options] <address> is the public address for other nodes to contact

OPTIONS:
   --folder value  Folder to keep all drand cryptographic information, with absolute path. (default: "/home/drand/.drand")
   --tls-disable   Disable TLS for all communications (not recommended). (default: false)
```

The generated key and all other drand state will be stored in `$HOME/.drand` by default, but this
can be overridden with the `--folder` flag.

The `--tls-disable` flag should only be used if you intend to run an insecure test deployment without TLS protection.
If either `drand` itself or a reverse proxy is providing TLS protection, the keypair must be generated with TLS
set to the default of `true`.

### `drand start`

The `start` command starts the drand daemon. Note that `drand` does not automatically go into the background when launched, and
long-running deployments should be run inside of a `screen` or `tmux` session, or otherwise "daemonized" using the tools available
for your operating system.

If this node has already joined a network by performing a Distributed Key Generation
phase, it will attempt to catch up with the drand beacon chain by contacting other nodes and will participate in the randomness
generation protocol once it has caught up.

If the DKG has not yet been performed, the daemon will wait for an operator to begin the DKG phase using the
[`drand share`](#drand-share) command.

```
$ drand help start

NAME:
   drand start - Start the drand daemon.

USAGE:
   drand start [command options] [arguments...]

OPTIONS:
   --folder value          Folder to keep all drand cryptographic information, with absolute path. (default: "/home/yusef/.drand")
   --tls-cert value        Set the TLS certificate chain (in PEM format) for this drand node. The certificates have to be specified as a list of whitespace-separated file paths. This parameter is required by default and can only be omitted if the --tls-disable flag is used.
   --tls-key value         Set the TLS private key (in PEM format) for this drand node. The key has to be specified as a file path. This parameter is required by default and can only be omitted if the --tls-disable flag is used.
   --tls-disable           Disable TLS for all communications (not recommended). (default: false)
   --control value         Set the port you want to listen to for control port commands. If not specified, we will use the default port 8888.
   --private-listen value  Set the listening (binding) address of the private API. Useful if you have some kind of proxy.
   --public-listen value   Set the listening (binding) address of the public API. Useful if you have some kind of proxy.
   --metrics value         Launch a metrics server at the specified (host:)port.
   --certs-dir value       directory containing trusted certificates. Useful for testing and self signed certificates
   --push                  Push mode forces the daemon to start making beacon requests to the other node, instead of waiting the other nodes contact it to catch-up on the round (default: false)
   --verbose               If set, verbosity is at the debug level (default: false)
   --private-rand          Enables the private randomness feature on the daemon. By default, this feature is disabled. (default: false)
```

#### Endpoint configuration

`drand` exposes up to four endpoints, depending on the flags passed in.

The **private Drand API endpoint** is used to communicate with other nodes using gRPC. The private API is always enabled.
If no flag is given, `drand` will bind to the address used when [generating the node's keypair](#drand-generate-keypair).
If you want `drand` to listen on a different interface and/or port, you can pass the `--private-listen` flag and
specify the `host:port` to bind to. Note that the addresss associated with the keypair must be publicly accessible
and mapped to the `--private-listen` address, for example using a reverse proxy.

::: warning
While the private API is primarily intended for inter-node communication, it may be exposed to the internet to allow clients
to fetch randomness over gRPC using the [`drand get`](#drand-get) command and/or [`drand-client`](#drand-client).
This will not allow access to any secret information, but we generally recommend restricting gRPC access using firewall
rules to limit the potential for denial of service attacks.
:::

The **control API endpoint** is used by the `drand` command to control a running drand daemon using commands like
[`drand share`](#drand-share).

The control interface is always enabled and bound to the `localhost` interface. The default port is `8888`, but this can be
overridden with the `--control` flag. If you use a non-standard control port, you will also need to use the `--control` flag
when running other commands such as `drand share`.

::: danger
The control API exposes private information, therefore, **the control port must not be exposed to the internet** and should be used only from the local machine where the `drand` daemon is running.
:::

The remaining endpoints are optional, and will only be enabled if the flags are given.

The **public HTTP endpoint** provides an API that clients can fetch randomness from. To enable it, pass in the
`--public-listen` flag and specify the `host:port` that you want to listen on. This endpoint exposes no sensitive
information and is safe to expose to the internet. Alternatively, you may keep this endpoint behind a firewall and
expose randomness to the public with the help of a relay server such as [`drand-relay-http`](#drand-relay-http).

Finally, the **metrics endpoint** provides an API for observing runtime metrics about the drand node. It can be enabled
with the `--metrics <metrics-port>` flag. See [Drand Metrics](./metrics/) for more details on accessing the metrics.

::: danger
The metrics API may expose sensitive information about the running `drand` daemon, and should not be exposed to the public internet.
:::

#### TLS Configuration

The `--tls-cert` and `--tls-key` commands give the path to TLS certificates and keys needed for `drand` to provide TLS protection
to its connections with other `drand` nodes. If you are using a reverse proxy as described in the [Deployment Guide](./deploy/),
you should pass the `--tls-disable` flag, as the proxy will handle TLS instead of `drand`.

::: danger
The `--tls-disable` flag may also be used to run without TLS entirely, but we **do not recommend** disabling TLS except for local
testing and `drand` development. If you do run without TLS, you must also provide the `--tls-disable` flag when
[generating your key](#drand-generate-keypair).
:::

For more on TLS setup, see the [Deployment Guide](./deploy/).

### `drand stop`

The `stop` command tells the `drand` daemon to shut down.

::: tip
If the daemon was started with a non-standard control port, you must use the `--control` flag to specify the control port
when running `drand stop`.
:::

### `drand share`

The `share` command tells the `drand` daemon to begin the Distributed Key Generation (DKG) protocol to create private key shares
with the other Drand nodes.

The `share` command must be used when setting up a new Drand network before randomness generation can begin. It may also be
used after the network is running to "re-share" the key material, which allows us to change the members of the Drand network
without interrupting the generation of randomness.

For details about to running the initial DKG, see the [Deployment Guide](./deploy/).

```
NAME:
   drand share - Launch a sharing protocol.

USAGE:
   drand share [command options] [arguments...]

OPTIONS:
   --tls-disable         Disable TLS for all communications (not recommended). (default: false)
   --control value       Set the port you want to listen to for control port commands. If not specified, we will use the default port 8888.
   --from value          Old group.toml path to specify when a new node wishes to participate in a resharing protocol. This flag is optional in case a node is alreadyincluded in the current DKG.
   --timeout value       Timeout to use during the DKG, in string format. Default is 10s
   --source value        Source flag allows to provide an executable which output will be used as additional entropy during resharing step.
   --user-source-only    user-source-only flag used with the source flag allows to only use the user's entropy to pick the dkg secret (won't be mixed with crypto/rand). Should be used for reproducibility and debbuging purposes. (default: false)
   --secret value        Specify the secret to use when doing the share so the leader knows you are an eligible potential participant
   --period value        period to set when doing a setup
   --nodes value         number of nodes expected (default: 0)
   --threshold value     threshold to use for the DKG (default: 0)
   --connect value       Address of the coordinator that will assemble the public keys and start the DKG
   --out value           save the group file into a separate file instead of stdout
   --leader              Specify if this node should act as the leader for setting up the group (default: false)
   --beacon-delay value  Leader uses this flag to specify the genesis time or transition time as a delay from when group is ready to run the share protocol (default: 0)
   --transition          When set, this flag indicates the share operation is a resharing. The node will use the currently stored group as the basis for the resharing (default: false)
```

The node that begins the sharing procedure should run with the `--leader` flag. The other nodes use the `--connect <leader-addr>` flag, passing
in the address of the leader. All of the nodes must specify the following values:

- `--secret` - a secret value, shared out-of-band with the other node operators. When re-sharing, this may be distinct from
  the secrets used for any prior DKG rounds.
- `--period` - sets the interval between rounds of the Drand beacon chain. This must be a string that's parse-able by Golang's
  [time.ParseDuration function](https://golang.org/pkg/time/#ParseDuration), for example "30s" or "1m".
- `--nodes` - the number of nodes expected to take part in the DKG. Note that the DKG will succeed even if fewer nodes participate,
  so long as there are enough to meet the threshold.
- `--threshold` - the number of nodes required to generate randomness. The DKG will fail if fewer than `threshold` nodes participate
  in the DKG before the timeout.

When re-sharing to nodes that are not members of the existing Drand group, the new nodes must obtain a copy of the group configuration file
from an existing member, and use the `--from <group-file-path>` flag to specify the path to the `group.toml` file. Members of
the existing group may omit the `--from` flag, as they already posess the current group configuration.

::: tip
You can mix an external source of entropy into the key sharing protocol by using the `--source` flag. The argument should be the path
to an executable that must output random binary data when run. By default, external entropy sources are mixed with Golang's `crypto/rand` secure RNG. The `--user-source-only` flag overrides this default, which is useful during testing and debugging to allow a reproducible "random" value,
but should not be used in production.
:::

### `drand get`

The `get` command allows you to fetch public information from a running Drand node, including random values and the public
distributed key. Note that you do not need to be a node operator or a member of the Drand group in order to use `drand get`,
but you will need a copy of the group configuration file. You will also need access to the gRPC API endpoint, which may be
protected by firewall rules.

There are three main subcommands for `drand get`:

- `drand get public <path-to-group.toml>` returns the latest public random value from the group described in `group.toml`.
  You may fetch a specific round instead of the latest by supplying the `--round <round-number>` flag.
- `drand get private <path-to-group.toml>` sends an encrypted request for private randomness to one of the nodes in `group.toml`.
- `drand get cokey <path-to-group.toml>` returns the distributed public key shared by all Drand nodes in the `group.toml`.

For full usage information, run `drand get --help`.

### `drand show`

The `show` command returns private information from a local `drand` node, including its private cryptographic material.

There are several subcommands for `drand show`:

- `drand show share` prints the private distributed key share for the local node.
- `drand show group` prints the group configuration file. If a DKG has been performed, this will include the distributed public key.
- `drand show cokey` prints the distributed public key, if a DKG has been performed.
- `drand show private` prints the long-term private key of the local node.
- `drand show public` prints the long-term public key of the local node.

For full usage information, run `drand show --help`.

### `drand util`

The `util` command provides several subcommands that are useful for debugging and managing local node state:

- `drand util check <address>` attempts to contact the node at the given address to see if it's online and responding to requests.
  This can be used to check that your local node is reachable at its public address, or to make sure that a remote node can be
  reached before running `drand share`.
- `drand util ping` sends a ping to the local `drand` daemon and prints its status.
- `drand util reset` deletes all distributed information (group file, key share, random beacon state, etc) from the local node. It
  does NOT delete the long-term keypair.
- `drand util del-beacon <round-number>` deletes all beacon chain rounds from `<round-number>` until the current head of the beacon
  chain from the local node's database. You MUST restart the daemon after issuing this command.

For full usage information, run `drand util --help`.

## Supplemental Tools

In addition to the main `drand` cli app, there are several supplemental tools that can be used to consume randomness from
a Drand network or help securely scale a Drand deployment.

The following tools do not yet have binary releases and must be installed from source. The basic procedure is the same
as [installing drand from source](#source-code), but instead of `make install` or `make build`, you'll run one of:

- `make client`
- `make relay-http`
- `make relay-gossip`

### `drand-client`

The `drand-client` command is a standalone Drand client that's optimized to fetch randomness from a Drand network and provide it over a CDN.

The client is configured with the URL for a Drand HTTP endpoint, and may optionally be configured with the addresses of one or more
libp2p relay nodes. If libp2p relays are configured, the HTTP endpoint will be used as a fallback if the libp2p relays fail to deliver
randomness at the expected interval.

To see full usage information, run `drand-client help`.

### `drand-relay-http`

The `drand-relay-http` command provides a gRPC to HTTP relay server that can be used to relay requests from the public internet to a Drand
daemon. This is an alternative to the public HTTP endpoint that runs in the main `drand` process when starting `drand` with the `--public-listen`
flag.

While the `--public-listen` flag is convenient, running a seperate relay process allows the HTTP communications to be isolated from the
main `drand` process, which limits the attack surface of the `drand` daemon.

To see full usage information, run `drand-relay-http help`.

### `drand-relay-gossip`

The `drand-relay-gossip` command provides a relay server that connects to a Drand node over gRPC and provides randomness to consumers over
a [libp2p PubSub](https://docs.libp2p.io/concepts/publish-subscribe/) topic. Randomness provided by a gossip relay may be consumed directly
over PubSub by libp2p-capable programs, and/or via a CDN which has been configured to listen to a PubSub topic using `drand-client`.
