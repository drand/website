---
title: Golang
---

# Golang

Drand can be installed using [Golang](https://golang.org/). By default, drand saves configuration files (long-term key pair, group file, and the collective public key) in the directory `$HOME/.drand/`.

1. Make sure you have a working [Golang](https://golang.org/doc/install) installation:

   ```bash
   go version
   > go version go1.14.3 windows/amd64
   ```

1. Ensure your `GOPATH` is set. You can find out how to do this on [golang.org](https://golang.org/doc/code.html#GOPATH), or by running `go help gopath`.

1. Clone the `drand/drand` repository:

   ```bash
   git clone https://github.com/drand/drand
   ```

1. Move into the `drand` folder and build the project:

   ```bash
   cd drand
   make install
   ```

1. The `make` process can take some time, depending on your system.
