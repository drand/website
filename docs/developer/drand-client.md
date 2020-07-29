# drand-client CLI

The `drand-client` command-line interface application can be used to fetch randomness from a drand network. It is a CLI frontend for the [drand client libraries](/developer/clients/).

## Installation

### From source

This will require a working [Golang installation](https://golang.org/doc/install). You'll also need the `make` command available.


```sh
git clone https://github.com/drand/drand
cd drand
make drand-client
```

### From docker

```sh
docker run drandorg/drand-client
```

## Usage

Run `drand-client --help` for a list of supported options. As an example, here is how to launch the client in order to read randomness for the current League of Entropy mainnet endpoints (with automatic verification, failover and fastest-endpoint optimizations):

```sh
drand-client --watch \
--chain-hash 8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce \
--url http://api.drand.sh \
--url http://api2.drand.sh \
--url http://api3.drand.sh \
--url https://drand.cloudflare.com \
--relay /dnsaddr/api.drand.sh \
--relay /dnsaddr/api2.drand.sh \
--relay /dnsaddr/api3.drand.sh
```
