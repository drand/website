---
title: 'Builders'
---

# Builder's Guide

This section helps you build applications that use Drand as a source of randomness. For help running a Drand network, see the [Operator's Guide](../operators/).

There are several ways to consume randomness from a Drand network:

- [Fetching randomness over HTTP](#fetching-randomness-over-http)
- [Using a Drand client library](#using-a-drand-client-library)
- [Using the `drand` binary](#using-the-drand-command-to-fetch-randomness)

## Fetching randomness over HTTP

Drand provides an HTTP interface that clients can use to fetch randomness from the Drand network.

All that's required is the address of the HTTP interface and way to fetch from HTTP, e.g. `curl`:

```
curl <address>/public/latest
```

This will return JSON output similar to the following:

```json
{
  "round": 367,
  "signature": "b62dd642e939191af1f9e15bef0f0b0e9562a5f570a12a231864afe468377e2a6424a92ccfc34ef1471cbd58c37c6b020cf75ce9446d2aa1252a090250b2b1441f8a2a0d22208dcc09332eaa0143c4a508be13de63978dbed273e3b9813130d5",
  "previous_signature": "afc545efb57f591dbdf833c339b3369f569566a93e49578db46b6586299422483b7a2d595814046e2847494b401650a0050981e716e531b6f4b620909c2bf1476fd82cf788a110becbc77e55746a7cccd47fb171e8ae2eea2a22fcc6a512486d",
  "randomness": "d7aed3686bf2be657e6d38c20999831308ee6244b68c8825676db580e7e3bec6"
}
```

## Using DrandJS

Drand can easily be used from JavaScript using [DrandJS](https://github.com/drand/drandjs). The main `fetchAndVerify` method of this JavaScript
library fetches from a drand node the latest random beacon generated and then verifies it against the distributed key. For more details on the
procedure and instructions on how to use it, refer to the readme.

## Using the `drand` command to fetch randomness

The `drand` command can be used to fetch randomness from a running Drand network. To do so, you'll need the group configuration file,
which can be obtained from a Drand node operator using the [`drand show group` command](../operators/drand-cli/#drand-show).

Once you have the group file, the latest randomness can be obtained with `drand get public`. The output will be in the same JSON format
as when fetching via HTTP. For more information, see the [Command Line Tools section](/operators/drand-cli/#drand-get).
