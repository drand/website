---
title: "Security Assessment of our tlock scheme"
summary: "Our tlock implementations were reviewed for security issues and are now production ready!"
date: 2023-05-26
author: Yolan Romailler
tags:
    - News
    - Updates
---

We are happy to announce that our timed release encryption scheme "[tlock](https://eprint.iacr.org/2023/189)" and its implementations, which we introduced in our [previous blog post](https://drand.love/blog/2023/03/28/timelock-on-fastnet/), have recently undergone a comprehensive security assessment by Kudelski Security. This was a crucial step in ensuring the robustness and reliability of our encryption system in order to guarantee that timelocked content remains encrypted until the time has come for it to be decrypted and never before.

## Overview

Kudelski Security, a renowned provider of cybersecurity solutions, was engaged to review the implementation of our timelock encryption scheme and timelock responsible disclosure demo. The work covered:

- `tlock`, our [Go implementation](https://github.com/drand/tlock/) as both a library and a command line tool (`tle`) for timelock encryption.
- `tlock-js`, our interoperable [TypeScript implementation](https://github.com/drand/tlock-js/) of timelock encryption.
- `timevault`, our web demo for timelock encryption, which is available at [https://timevault.drand.love/](https://timevault.drand.love/).
- Their critical security dependencies.

The audit primarily focused on code security, protocol security and ensuring our implementations matched our paper.

## Audit Findings

During the audit, Kudelski Security identified:

- 1 High severity issue
- 5 Medium severity issues
- 3 Low severity issues

None of which would have put existing encrypted data at risk. We are pleased to report that all identified issues have been addressed and corrected. The **detailed audit report is available on IPFS** with CID [QmWQvTdiD3fSwJgasPLppHZKP6SMvsuTUnb1vRP2xM7y4m](https://ipfs.io/ipfs/QmWQvTdiD3fSwJgasPLppHZKP6SMvsuTUnb1vRP2xM7y4m).

## Security Considerations

The security of our timelock encryption system relies on four main aspects:

1. The security of the [Identity Encryption Scheme](https://en.wikipedia.org/wiki/Boneh%E2%80%93Franklin_scheme) from 2001 that we used, and our implementation of it.
2. The security of the underlying threshold [BLS scheme](https://en.wikipedia.org/wiki/BLS_digital_signature) from 2003 that we used, and our implementation of it.
3. The security of `age`'s underlying primitives, and that of the `age` implementation used to encrypt the actual data. (See [https://age-encryption.org/](https://age-encryption.org/) for details about `age`.)
4. The security of the threshold network providing you with its BLS signatures at a given frequency.

Please note that neither the BLS nor the IBE scheme are "quantum resistant". However, a quantum computer that is able to break them seems unlikely to be built within the next 5-10 years and therefore we currently consider that you can expect a "long term security" horizon of at least 5 years by relying on our design for timed release encryption.

## Conclusion

We are grateful to the Kudelski Security Research team for their thorough and professional audit. Their expertise has been critical in helping us improve the security of our timelock encryption. We also want to thank them for their collaboration and availability throughout the assessment.

However, it's important to note that no security assessment can guarantee 100% security. While we've taken extensive measures to ensure the security of our timelock encryption system, we encourage users to understand the security considerations and make informed decisions, especially when encrypting data for a long time period.

We look forward to continuing to enhance the security and reliability of our systems, and we remain committed to transparency and collaboration in all our endeavours.
