---
title: Drand Documentation
description: The home page for developer documentation for drand, a distributed randomness beacon.
---

# Drand documentation

There is a considerable need for randomness generators. Things like lotteries, jury selection, and election events all rely on random number generators. More importantly, Cryptography heavily relies on randomness to produce secure keys and links. In the past, there have been cases where the randomness used wasn't random enough and was exploited. There have been cases where attackers have rigged lotteries and elections by influencing the randomness of a system.

To mitigate this exploitation, researchers have defined five points that a strong random-number-generator should be:

- Unpredictable: you can't predict the next number to come out of the generator.
- Publicly-verifiable: anyone can verify that a random number is a legitimately _random_ number.
- Bias-resistant: you can't lead the generator one way or another.
- Decentralized: a set of independent parties produces random numbers.
- Always available: the system must always be able to provide random numbers.

There have been a collection of systems that have attempted to provide strong randomness, but they have all fallen short of at least one of the above attributes. NIST is a project ran by the United States government that aims to produce randomness by using quantum entanglement. While this is an excellent way to produce incredibly random numbers, there is no way to an end-user to verify that the numbers they are getting from NIST are random. Users have to trust that the system is providing genuinely random numbers. Bitcoin is also able to produce random numbers. However, the cryptocurrency is reasonably centralized, with power coming from a handful of mining pools. Randhound is the most robust random number generator so far. It claims to be scalable, bias-resistant, unpredictable, verifiable, and decentralized. However, tests have shown that it offers probabilistic guarantees, meaning that a user could have the system lean towards numbers favorable to that user. In practice, Randhound is hard to set up and takes a while to generate an output.

The Drand project exists because of these issues. It's a piece of software ran by a group of independent nodes that collectively produce randomness-as-a-service. The goal is to make Drand as simple as Network Time Protocol (NTP) servers. NTP servers output the current time when requested. There are thousands of NTP servers around the world, and they're all in sync with each other, providing accurate times to millions of devices.
