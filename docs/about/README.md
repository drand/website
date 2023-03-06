---
title: About
---

# About

> This page was originally posted on [Cloudflare's randomness beacon documentation website](https://developers.cloudflare.com/randomness-beacon/).

---

Drand (pronounced "dee-rand") is a distributed randomness beacon daemon written
in Golang. Servers running drand can be linked with each other to produce
collective, publicly verifiable, unbiased, unpredictable random values at fixed
intervals using bilinear pairings and threshold cryptography.

Drand is meant to be an Internet infrastructure level service that provides
randomness to applications, similar to how NTP provides timing information and
Certificate Transparency logs provide certificate issuance information for free.

## Why decentralized randomness is important

Over the years, a generation of public randomness (often referred to as common
coins) has attracted continuous interest from the cryptography research
community. Many distributed systems, including various consensus mechanisms,
anonymity networks such as Tor, or blockchain systems, assume access to such
public randomness. For example, in recent Proof of Stakes blockchains, miners
are being elected randomly at each epoch via a common source of randomness.
However, it remained a major missing piece of the puzzle to have a _unbiasable_
public source of randomness which is distributed & scalable.
There are some centralized solutions which exists as of today, for example the
randomness beacon run by [NIST](https://beacon.nist.gov/home) or the one from
the [University of Chile](https://random.uchile.cl/en/about/). Even though they
do provide an uniform source of randomness, these beacons are not _verifiable_
nor _decentralized_. Verifiability is necessary for examples in Proof of Stakes
systems where a block producer needs to prove he has been elected as a miner for
the given epoch. Decentralization helps for the liveness of the beacon.

## Origins of drand

Drand's development originally started in 2017 at the [DEDIS](https://dedis.ch)
lab at [EPFL](https://epfl.ch) by Nicolas GAILLY, a PhD student at the time
with the help of Philipp Jovanovic and under the supervision of Bryan Ford.

The DEDIS lab was already working on a decentralized randomness project called
[Scalable Bias-Resistant Distributed
Randomness](https://eprint.iacr.org/2016/1067) led by [Ewa
Syta](http://ewa.syta.us/), that started under the supervision of [Michael J.
Fischer](http://www.cs.yale.edu/homes/fischer/) and [Bryan
Ford](https://bford.info/) at Yale University.  After Bryan moved to EPFL in
2015, the new members of the DEDIS team at EPFL ([Nicolas
Gailly](https://nikkolasg.xyz), [Linus
Gasser](https://people.epfl.ch/linus.gasser), [Philipp
Jovanovic](https://jovanovic.io/), [Ismail Khoffi](https://ismailkhoffi.com/),
[Eleftherios Kokoris Kogias](https://lefteriskk.github.io/)) joined the project
and together published a research paper at the [2017 IEEE Symposium on Security
and Privacy](https://ieeexplore.ieee.org/abstract/document/7958592).

However, that system presented a randomness generation protocol with multiple
rounds, a complex node topology, a large transcript to verify for the end user
and a client that needed to actively participate in the request. Using more
recent development in the field of pairing based cryptography, we could devise
the next generation of randomness beacon with a trivial protocol and with faster
verification and shorter transcript.

In early 2017, the DEDIS team started a collaboration with
[DFINITY](https://dfinity.org) on various topics including public randomness.
Indeed, DFINITY's architecture included the notion of a randomness source that
uses the same cryptographic techniques as drand. Additionally, they had
implemented an optimized pairing library in C++ for the BN256 curve. After
integrating this implementation into the DEDIS’ crypto library
[Kyber](https://github.com/dedis/kyber), all major cryptographic components
were ready to implement an efficient, distributed randomness generation protocol
using pairings.

Thanks to the use of pairing based cryptography, drand is able to generate verifiable
randomness in a very simple and efficient manner and to deliver it in a reliable
way to the clients. Drand was meant to be from the ground up a distributed
service providing public randomness in an application-agnostic, secure, and
efficient way. And _nothing else_. The idea is that instead of having each
decentralized systems re-inventing the wheel internally, often poorly, drand would
provide it for them.

As drand has gained maturity, an increasing number of organizations (including
NIST, Cloudflare, Kudelski Security, the University of Chile, and Protocol Labs)
started taking interest, and decided to collectively work on setting up a drand
network spanning these organizations. To support the use of public randomness in
web applications, Mathilde Raynal, then a master student at DEDIS, started
developing a JavaScript proof-of-concept frontend, called drandjs, to interact
with drand servers.

In 2019 the League of Entropy was [officially launched](https://blog.cloudflare.com/league-of-entropy/)
in an effort led by Cloudflare, during their Crypto Week 2019. Initially the League
was a consortium of ~7 global organizations and individual contributors.

In spring 2020, a team at Protocol Labs led the efforts to take drand from an experimental
to a production-ready network. These efforts included significant protocol upgrades,
establishment of a governance model for the distributed network, and increased
operational security of node operators.

We re-launched in August 2020 a [new network](blog/2020/08/10/drand-launches-v1-0),
still running currently and called the "drand default mainnet", with the League of
Entropy which had by then grown to include 14 partners.

Since then, drand has been used for a variety of purposes, including leader-election in
some consensus mechanisms, providing smart contract with unbiased, unpredictable
randomness, random sampling in the frame of covid-19 projects, indirectly serving as a
decryption key oracle for timelock encryption, is used in a RNG certified by
Gaming Labs International for several lottery games, sortitions in various settings,
and more!

## Acknowledgments

Thanks to  [@herumi](https://github.com/herumi)for providing support on his
optimized pairing-based cryptographic library used in the first version. Thanks
to Apostol Vassilev for its interest in drand and the extensive and helpful
discussions on the drand design. Thanks to
[@Bren2010](https://github.com/Bren2010) and
[@grittygrease](https://github.com/grittygrease) for providing the native Golang
bn256 implementation and for their help in the design of drand and future ideas.

Finally, two special notes:
* [Bryan Ford](https://bford.info/) from the [DEDIS lab](https://dedis.ch) for
  supporting the development of drand.
* Juan Benet, from [Protocol Labs](https://protocol.ai), for believing in the
  project and providing the push to make drand a production ready network.

:::tip Get in touch
If you have any questions or comments, you can reach the Drand team at [leagueofentropy@googlegroups.com](mailto:leagueofentropy@googlegroups.com) or join the [drand slack workspace](https://join.slack.com/t/drandworkspace/shared_invite/zt-19u4rf6if-bf7lxIvF2zYn4~TrBwfkiA).
:::
