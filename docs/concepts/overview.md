---
title: Overview
description: Learn about the basics of Drand, how it works, and why it exists in the first place.
---

# Overview

Learn about the basics of Drand, how it works, and why it exists in the first place.

## Randomness matters

Randomness serves a vital role in nearly every aspect of modern civilization. Voting systems, traffic management, and even financial services all depend on randomness in some way. But by far, the most important and widely used aspect of randomness is within the field of cryptography. When connecting to a Wifi network using the WPA2 security protocol

WPA2 is the most widely used security protocol for connecting to Wifi networks. If a laptop wants to connect to a Wifi network, the Wifi access-point generates a large random number and sends it to the computer. At the same time, the laptop produces a large random number and sends it to the Wifi access point.

<!-- TODO: explain how this works, maybe with a diagram. -->

### Current randomness generators

There have been a collection of systems that have attempted to provide strong randomness, but they have all fallen short.

The United States' [National Institute of Standards and Technology (NIST)'](https://www.nist.gov/) has a project that aims to produce randomness by using quantum entanglement. While this is an excellent way to produce incredibly random numbers, there is no way for an end-user to verify that the numbers they are getting from NIST are random. Users have to trust that the system is providing genuinely random numbers.

Bitcoin is also able to [produce random numbers](https://eprint.iacr.org/2015/1015.pdf). However, the cryptocurrency is reasonably centralized, with power coming from a handful of mining pools.

[Randhound](https://eprint.iacr.org/2016/1067.pdf) is the most robust random number generator so far. It claims to be scalable, bias-resistant, unpredictable, verifiable, and decentralized. However, tests have shown that it offers probabilistic guarantees, meaning that an attacker could have the system lean towards favorable numbers. Randhound is also hard to set up and takes a while to generate an output.

### Features of good randomness

There have been cases where attackers have rigged lotteries and elections by influencing the randomness of a system. To mitigate this exploitation, researchers have defined five points that a strong random-number-generator should be:

- Unpredictable: you can't predict the next number to come out of the generator.
- Publicly-verifiable: anyone can verify that a random number is a legitimately _random_ number.
- Bias-resistant: you can't lead the generator one way or another.
- Decentralized: a set of independent parties produces random numbers.
- Always available: the system must always be able to provide random numbers.

## How drand works

Here's a very brief rundown of how drand works. For a deep-dive into the intricacies of drand, check out the [project specifications](/concepts/specification).

### Generating numbers

<!-- TODO: how drand generates randomness -->

### Decentralized randomness

<!-- TODO: why drand is decentralized -->

### Node communication

<!-- TODO: how drand nodes talk to each other -->

## Drand for everyone

Defining precisely who will use drand is pointless since the project will generate random numbers for billions of applications, messages, transactions, and services around the world! However, this website is for developers looking to integrate drand into their projects, and for infrastructure specialists wanting to host a drand node.

<!-- From Overview.md

# Overview

Many of the digital applications we rely on require a secure source of randomness to work effectively. Examples include generating cryptographic parameters, electronic voting systems, blockchain networks, and statistical sampling of large data sets.

However, constructing a secure source of randomness is not a trivial matter, especially if the random values need to be shared with many participants. While most computers are capable of generating randomness locally (using, for example, `/dev/urandom` on UNIX platforms), it's not possible to prove to someone else that the generated value was truly random and not subject to some bias. There are also countless examples of attacks on secure systems that were made possible by weaknesses in random number generation, including the use of algorithms with non-uniform distribution or biased output. Such flaws can undermine the foundation of an otherwise secure system and lead to severe and subtle vulnerabilities.

Drand aims to address this problem by providing a randomness-as-a-service network, similar to the NTP network, which provides time-as-a-service or certificate authority servers that provide certificate verification. Drand provides a continuous source of randomness with these critical properties:

- **Decentralized**: a Drand network is not controlled by any one of its members, which means that there is no single point of failure, and none of the Drand server operators can bias the output.
- **Publicly verifiable**: Drand periodically delivers randomness that is publicly verifiable and unbiased. Any third party can fetch and verify the randomness's authenticity to ensure it hasn't been tampered with.
- **Optionally private**: in addition to "public" randomness, Drand nodes can also deliver "private" encrypted randomness to be used in local applications. This may be used to seed the operating system RNG with an outside source of entropy.

## Public Randomness

Generating public randomness is the primary functionality of Drand. Public randomness is generated collectively by Drand nodes and made publicly available. The main challenge in generating good randomness is that no party involved in the randomness generation process should be able to predict or bias the final output. Additionally, the final result has to be verifiable by a third-party to make it actually useful for applications like lotteries, sharding, or parameter generation in security protocols.

A drand randomness beacon is composed of a distributed set of nodes and has two phases:

- **Setup**: Each node first generates a long-term public/private key pair. Then all of the public keys are written to a _group file_ together with some further metadata required to operate the beacon. After this group file has been distributed, the nodes perform a distributed key generation (DKG) protocol to create the collective public key and one private key share per server. The participants NEVER see/use the actual (distributed) private key explicitly but instead utilize their respective private key shares for the generation of public randomness.
- **Generation**: After the setup, the nodes switch to the randomness generation mode. Any of the nodes can initiate a randomness generation round by broadcasting a message which all the other participants sign using a t-of-n threshold version of the Boneh-Lynn-Shacham (BLS) signature scheme and their respective private key shares. Once any node (or third-party observer) has gathered `t` partial signatures, it can reconstruct the full BLS signature (using Lagrange interpolation). The signature is then hashed using SHA-512 to ensure that there is no bias in the byte representation of the final output. This hash corresponds to the collective random value and can be verified against the collective public key.

## Private Randomness

Private randomness generation is the secondary functionality of drand. Clients can request private randomness from some or all of the drand nodes which extract it locally from their entropy pools and send it back in encrypted form. This can be useful to gather randomness from different entropy sources, for example, in embedded devices.

In this mode, we assume that a client has a private/public key pair and encapsulates its public key towards the server's public key using the ECIES encryption scheme. After receiving a request, the drand node produces 32 random bytes locally (using Go's crypto/rand interface), encrypts them using the received public key, and sends it back to the client.

**Note**: Assuming that clients without good local entropy sources (such as embedded devices) use this process to gather high entropy randomness to bootstrap their local PRNGs, we emphasize that the initial client key pair has to be provided by a trusted source (such as the device manufacturer). Otherwise, we run into the chicken-and-egg problem of how to produce on the client's side a secure, ephemeral key pair for ECIES encryption without a good (local) source of randomness. -->
