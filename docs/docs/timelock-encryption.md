---
title: Timelock Encryption
sidebarDepth: 2
---

# Timelock Encryption

## What is it?

Timelock encryption is a way of encrypting something now that cannot be decrypted until a future time has been reached. Previous attempts at practical timelock encryption have involved using either a trusted third party to store keys or [proof of work](https://ethereum.org/en/developers/docs/consensus-mechanisms/pow/), requiring users to perform computation until they can decrypt a ciphertext.  
Proof of work has proven ineffective in the face of improved hardware and computational science, as well as wasting a lot of energy.  
Using a trusted third party does not have the same pitfalls, however the security model relies on having a third party you can trust and hoping that they don't get breached!  

Since the launch of our [unchained scheme](https://drand.love/blog/2022/02/21/multi-frequency-support-and-timelock-encryption-capabilities/), drand has supported a new paradigm for enabling timelock encryption!  
Fundamentally, drand is a reference clock: each drand round is mapped to a set time on the clock, and nodes in the network gossip their signature over that round number once the time has been reached. Each node can aggregate those signatures together to form a full randomness beacon, providing an attestation that a threshold number of nodes in the network believe that clock time has been reached.

In our timelock scheme, we have exploited [identity-based encryption](https://crypto.stanford.edu/~dabo/papers/bfibe.pdf) to allow users to create a ciphertext that uses the random value from a future round as a private key to decrypt it. Given the drand network will not release that randomness until the clock time has been reached (unless somehow a threshold of malicious nodes join the network and work together), this provides us accurate timelock encryption without wasting a large amounts of energy or trusting a single third party!  
Additionally, this means that users can decrypt their timelock ciphertext *offline*, rather than requiring submission to a third party to do it for them.

## I don't have time to read all of this

- [here is our blog post announcing the new network and timelock encryption](https://drand.love/blog/2023/03/28/timelock-on-fastnet/)
- [here is Yolan's talk at Real World Crypto](https://www.youtube.com/watch?v=Xh849Ij3lhU) on timelock encryption
- [here is the paper on eprint](https://eprint.iacr.org/2023/189)


## ⚠️ Security assumptions ⚠️

While our timelock scheme has been assessed for security issues by renowned security firm [Kudelski Security](https://kudelskisecurity.com)[1], as with any cryptographic scheme, it's important to understand its limitations before you go and bet the farm on it! This is not an exhaustive list, and you ought to also read the [drand security model](https://drand.love/docs/security-model/), but it's a good place to start.

- **there have never been a threshold of malicious nodes in the drand network**

If there were, at any time, a threshold number of malicious nodes in the network, they could cooperatively generate all future random values and use them to decrypt arbitrary future timelock ciphertexts. Drand randomness, while unpredictable, is entirely deterministic, even after the resharing of keys.
That said, `fastnet` (our new network for timelock encryption) was started with 16 different participants running 23 nodes, so we're confident a threshold number of them have not been compromised!

- **neither the scheme, nor drand are quantum resistant**

The cryptography we employ do not use quantum resistant algorithms. If you timelock encrypt something for 1000 years and a viable quantum computer becomes available, anybody can decrypt it. Right now there are no widespread quantum resistant schemes for threshold cryptography, but we're keeping an eye out for the future!
To that end, consider it relatively safe to timelock encrypt something for 5-20 years depending on how bullish you are on quantum computing.

- **if the League of Entropy shuts down, members will delete their keys**

The world is unpredictable (just like drand randomness... heh), and it's possible that the League of Entropy will all hang up their coats at some point in the future. Should that happen, members would have two choices with their private keys: release them to the world or delete them entirely.
The former would mean that ciphertexts created for some time after the cessation of the network would be decryptable to everybody. The latter would mean that ciphertexts created for some time after the cessation of the network would be unencryptable forever (/until quantum computers can break them).
In the interests of privacy, we felt the latter option was preferable. That said, if you encrypt the private key to your Filecoin fortune to stop yourself from spending it now and the network stops... you're going to have a bad time.

[1] their report is available in timelocked form [here](https://research.kudelskisecurity.com/2023/01/09/announcing-a-timelocked-responsible-disclosure/), although it was encrypted using the drand testnet, so you will need to use the [tlock go library](https://github.com/drand/tlock) to decrypt it by passing in the testnet details. All the security issues they identified have since been remediated! You can find remediation details in the github issues of the relevant repos.

## Use cases

We have identified some cool use cases for timelock encryption, but these are certainly not exhaustive - hopefully you can come up with new, innovative use cases we haven't thought of!

- [responsible vulnerability disclosure](https://timevault.drand.love/)
- transfer of assets/password upon death
- sealed bid auctions
- [MEV prevention](https://coinmarketcap.com/alexandria/glossary/miner-extractable-value-mev)
- public turn-based games
- voting
- quizzes

## The math bit 🤓

### Encryption

A client that wishes to encrypt a message $M \in {0,1}^l$ only decryptable at the epoch $p$ will perform the following:

1. Compute $\mathbb{G_{id}}= e(P, Q_{id}) = e(P,H_1(p))$, the "round public key" 
- (this can be pre-computed per epoch, it's the same for everyone)

2. Choose a random $(\theta \in {0,1}^l)$, "the mask"

3. Set $r = H_3(\theta, M)$ where $H_3:{0,1}^* \to F_q$ is a secure hash function, "the ephemeral secret key"

4. Output the ciphertext $C = {U, V, W}$ where:

    $U = rG_1,$ "the ephemeral public key"

    $V = \theta \oplus H_2(rG_{id})$, "the mask commitment"

    $W = M \oplus H_4(\theta)$, "the one-time pad"

### Decryption

A client that wishes to decrypt a ciphertext $V$ takes the associated signature of epoch $p: \pi_p$ and performs the following:

1. Compute $\theta = V \oplus H_2(e(U, \pi_p))$

2. Compute $M = W \oplus H_4(\theta)$

3. Set $r = H_3(\theta, M)$

4. Test that $U = rG_1 \to$ if not, reject

5. $M$ is the corresponding plaintext


## Libraries available for timelock encryption

Listed below are various libraries and clients for using timelock encryption. Details on how to install and use them are available at the links provided.

- [tlock](https://github.com/drand/tlock)

tlock is a go CLI and library developed by [Ardan Labs](https://www.ardanlabs.com/) and maintained by the drand team for performing timelock encryption and decryption

- [tlock-js](https://github.com/drand/tlock-js)

tlock-js is a javascript library developed and maintained by the drand team for performing timelock encryption and decryption written in Typescript

- [dee](https://github.com/thibmeu/drand-rs)

dee is a rust CLI developed and maintained by Thibault Meunier from cloudflare. It can perform timelock encryption and decryption, as well as retrieve beacons from any of the drand networks.

- [timevault](https://timelock.drand.love)

timevault is a web app for timelock encrypting and decrypting vulnerability reports for responsible disclosure as well as arbitrary text. It is developed and maintained by the drand team.

- tlock-fvm

Timelock encryption and decryption will be available on the [Filecoin Virtual Machine](https://fvm.bilecoin.io/) in the second half of 2023. Stay tuned to our blog for updates!
