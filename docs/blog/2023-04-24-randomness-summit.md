---
title: "Randomness Summit Tokyo 2023"
summary: "A breakdown of what happened at our Randomness Summit in Tokyo"
date: 2023-04-24
author: Patrick McClurg
tags:
    - News
    - Conferences and Events
---

On the 30th of March, the drand team hosted the second edition of the Randomness Summit alongside [Real World Crypto](https://rwc.iacr.org) in Tokyo, the first having been [online only in 2020](https://randomness2020.com) during the covid19 pandemic.

The Randomness Summit was a one day conference consisting of talks from a range of speakers on topics such as verifiable randomness functions, verifiable delay functions, distributed key generation, cryptographic specifications and more!

To kick off the day, Patrick from the drand team gave a brief overview of what's happened with drand since the last randomness summit. 
Following him, Lefteris from Mysten Labs gave a presentation on generating distributed randomness and how to architect for producing it under asynchrony safely.
Filippo Valsorda then gave a presentation giving some recommendations for specification-writers on how to avoid common pitfalls when specifying protocols and schemes using randomness.
Bernardo from the University of Copenhagen came next and gave a comprehensive breakdown of all the different types of randomness beacons, their guarantees and how to combine them to fit your security model.
Pratyay came next, presenting the architecture of the [Supra](https://supraoracles.com/) VRF, the challenges they faced in designing it, and the innovative solutions they created to overcome them.
Luis from NIST presented a little on what NIST is currently doing in the randomness space, particularly around their ongoing effort to standardise randomness beacons and threshold cryptography. Details on their standardisation tracks can be found [on the NIST website](https://csrc.nist.gov/projects/interoperable-randomness-beacons).
Matej from the Consensus Lab team in Protocol Labs gave the next presentation on the latest research into scalable byzantine fault tolerance algorithms, and how randomness can be used to improve their performance characteristics.
Following up from his talk at the main Real World Crypto conference, Yolan from the drand team gave a shortened rendition of his talk on timelock encryption. The full thing can be found on the [IACR youtube channel](https://www.youtube.com/watch?v=Xh849Ij3lhU).

To end the day, we had a few presentations from people using randomness in the wild: 
Hong Yu from Storswift (a member of the League of Entropy who runs a relay in Asia) presented both their upcoming drand implementation in rust, as well as a no-code tool they've created to create smart contracts using timelock encryption.
Finally, Thibault from Cloudflare (also a member of the League of Entropy) presented his new [CLI dee](https://github.com/thibmeu/drand-rs) which is both a drand client and timelock encryption tool - the team at drand have been using it a lot and loving it!

For those who couldn't make it on the day (in person or online), we have compiled a youtube playlist of all the talks that can be found [here](https://www.youtube.com/watch?v=U4bEewhZIus&list=PLhuBigpl7lqtE883Z3I6FCrtjmVOJ7A9c).
Also, the slide decks are available for download on IPFS: [Qmd8Hbj31yXq6MDptaiez5JiRiG3vyU672oYTFfaV31NZL](https://ipfs.io/ipfs/Qmd8Hbj31yXq6MDptaiez5JiRiG3vyU672oYTFfaV31NZL)

It's still too early to release any details of a possible Randomness Summit 2024, but a big thank you to everyone who came along and we look forward to seeing you (and others!) at future events!
