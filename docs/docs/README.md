# Docs

This section introduces the key concepts behind drand. For information about consuming the randomness from a drand network, see the [Developer's Guide](/developer/), or for help running a drand network, see the [Operator's Guide](/operator/).

- [Overview](/docs/overview/) describes drand's main goals and gives an overview of the problems it aims to
  address.
- [Cryptography](/docs/cryptography/) provides an overview of the cryptographic building blocks that drand uses to generate publicly-verifiable, unbiased, and unpredictable randomness in a distributed manner.
- [Security model](/docs/security-model/) describes the security considerations taken into account when designing and building drand.
- [Specification](/docs/specification/) is a formal description of the drand protocols.


::: warning
As of Q2'22, the drand network operated by the [League of Entropy (LoE)](https://blog.cloudflare.com/league-of-entropy/) is running a testnet that integrates support for multi-frequency beacons and unchained randomness. You can read all the details in [this blogpost](https://drand.love/blog/2022/02/21/multi-frequency-support-and-timelock-encryption-capabilities/). The documentation in this site has been updated to include mention of these features, although they are not currently supported in LoE's drand mainnet. All changes are backward compatible. We expect that mainnet will switch to unchained randomness and support for multi-frequency beacons in Q4'22.
:::
