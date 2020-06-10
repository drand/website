---
title: Security Model
sidebarDepth: 2
---

# Drand's Security Model

## Notations

**Drand node**: a node that is running the `drand` daemon and participating in the
creation of the randomness. After running the setup/resharing phase, each Drand
node has a common long-term distributed public key and a private share of the
distributed private key.
The **Drand network** is the set of Drand nodes connected with each other.

**Relay node**: a node that is connected to a `drand` daemon and exposes an
Internet-facing interface allowing users to fetch the public randomness. The **relay
network** is the set of relay nodes, partially / potentially connected with each
other.

When the type of the node is not specified in the document, it is assumed from
the context - most often it refers to a Drand node.

**Corrupted node**: a node which is in the control of an attacker. In this case
we assume that the attacker has access to all the cryptographic material this node
possesses, as well as the networking authorization. For example, if a relay node is
corrupted, an attacker has a direct connection to a Drand node.

**Offline node**: a node that is unreachable from an external point of view. It
can be offline from the point of view of another Drand node or a relay node. The
document tries to clarify in which context when relevant.

**Online node**: a node which is running the binary (`drand` or a relay depending on
the context) and sending packets out to the Internet that are correctly received by
the endpoint(s).

## Security Model

In Drand, there are two phases which do not require the same security
assumptions. This section highlights both models and the practical realization
or assumptions taken.

### Distributed Key Generation Ceremony (Setup Phase)

The DKG protocol model follows the one from [Pedersen's protocol](https://link.springer.com/chapter/10.1007/3-540-46416-6_47).

[Gennaro's paper](https://www.researchgate.net/publication/225722958_Secure_Distributed_Key_Generation_for_Discrete-Log_Based_Cryptosystems) explains the protocol and its assumptions.

Drand satisfies these assumptions in the following way:

**Synchronous Network**: A packet sent from an online node reaches its
destination in a bounded amount of time. Drand realizes this assumption by the
usage of timeouts during the DKG protocol.

**Synchronized Clocks**: All nodes must have roughly synchronized clocks (less
than one 1s of offset).

**Reliable Broadcast Channel**: When a node broadcasts a packet to all other
nodes, each other node is guaranteed to receive the same exact packet after some
bounded amount of time. This assumption is not strictly realized by Drand
currently. See [DKG attacks](#distributed-key-generation-ceremony) section to understand the impact.

**Authenticated Channel**: All communication between nodes must be
authenticated. Drand achieves this by signing every outgoing DKG packet with
a BLS signature produced using the long-term public key of the sender node.

**Public Group**: Every node willing to run the DKG must know the group
formation before starting the DKG, including the long-term public keys of each
node. During the DKG, there might be some nodes offline or misbehaving. The set
of nodes that _successfully_ pass the DKG are called the _qualified_ set of
nodes (QUAL). Only these nodes have valid shares and are able to produce
partial beacons that can be successfully validated with respect to the
distributed public key.

**DKG's biasability in signatures**: Pedersen's DKG is known to exhibit a
weakness in the biasability in the distribution of the distributed private key.
However, the same authors (Gennaro et al.) that proved the latter also proved
this bias is not relevant in the setting of using the DKG to perform digital
signatures, which offers other strong properties -
[paper](https://pdfs.semanticscholar.org/642b/d1bbc86c7750cef9fa770e9e4ba86bd49eb9.pdf).
In particular, the paper mentions discrete log based systems. However, it is not
yet strictly proven that systems using computational Diffie–Hellman assumptions as required
for threshold BLS signatures are secure in the model of Gennaro. However, it is
believed that this assumptions holds in this context as well and is being worked
on. Note that using threshold BLS signatures as a source of randomness _is_
formally proven secure in this [paper](https://eprint.iacr.org/2020/096.pdf)
from Galindo et al.

### Randomness generation model

**Network**: The randomness generation protocol does not make any assumptions on
the network bounds. As soon as packets come in, nodes process them and the
chain advances if conditions are met (enough partial beacons and time for a new round).

**Synchronized Clocks**: All nodes must have roughly synchronized clocks to
start the rounds at the same time. The accuracy of the synchronicity between
clocks only needs to be at the order the round frequency (order of tens of
seconds), which is much higher than the reality of the server's clock (NTP-synced
servers achieve [offsets of under a second over the globe](https://www.eecis.udel.edu/~mills/database/reports/ntp-survey99-minar.pdf)).

**Broadcast channel**: The randomness generation model only needs a regular
broadcast channel. It does **not** need to be reliable given the deterministic
nature of a partial beacon and the Drand chain: for a given round, a given node
can only send one valid partial beacon.

**Threshold**: The threshold is the amount of nodes that must be online and
honest at a given time to broadcast their partial signature in order to create
the final random beacon. See the [attack section](#attack-vectors) to understand the
consequences when that is not the case.

**Determinism of the chain**: The chain is deterministic with respect to a fresh
DKG phase. This means that if an actor collects over a threshold of private shares, it
can generate all future chain beacons. When a resharing occurs, the individual
shares of each Drand node change but the chain remains the same as well. If the
same set of nodes perform a new fresh DKG, it will create a new chain from
scratch.

**Resharing**: During a resharing, a Drand network `A` (with threshold
`tA`) creates new shares for a Drand network `B` (with threshold `tB`) which can be
disjoint from `A`, such that the Drand network `B` is now responsible for continuing to
create Drand beacons, while the distributed public key doesn't change.
For this to happen, there needs to be at least `tA` nodes from network `A` and
`tB` nodes online and honest during the resharing. At the end of the protocol,
there are going to be at least `tB` nodes that are qualified and have private shares
to generate randomness.

## Attack Vectors

### Randomness Generation

There can be multiple ways of attacking the Drand network during the randomness
generation phase, each with different consequences.

#### Front Running

1. Passive Adversary Scenario

   An attacker that is able to listen passively on the traffic
   between nodes (**if** TLS is not used - which is not a recommended setup) OR that is
   able to listen to plaintext traffic from the network of a threshold of nodes might be
   able to see a threshold number of partial beacons before any other honest nodes.

   Consequence: The attacker in such position is able to aggregate the final
   beacon of the current round before any other Drand nodes. However, the advantage
   should as most half of the RTT of the slowest of the links between the honest
   Drand nodes. Drand end users should be using the round number as a marker and
   not the time accuracy which may not be granular enough for some applications.

2. Active Adversary Scenario

   Assuming the threshold is 50%+1, an adversary tries to "take down" N/2 Drand
   nodes by either running a Denial-of-Service (DoS) attack or blocking outgoing traffic
   from these Drand nodes.

   Consequence: The adversary becomes the node that can decide whether to aggregate
   the final beacon of the current round or not, because the rest of the still
   alive nodes will send their partial beacons to the adversary, but the adversary
   does not send its own partial beacon, effectively becoming the last "missing piece"
   to create the final beacon. The adversary has the choice to release the final beacon
   now or later, and the adversary can already use the final beacon for the application
   while the rest of the network does not know it yet.

#### DoS the Drand network

**Scenario**: There is a DoS attack on multiple Drand nodes, and at least a
threshold of honest Drand nodes are now considered offline and can't get each
other's partial beacons. The attack is sustained for a duration `X`. The threshold of
nodes to DoS is the threshold from the group configuration as defined during
the DKG phase (the threshold must strictly be more than 50% of the nodes).

**Consequence**: The chain halts for as long as the DoS attack is sustained on
the Drand nodes, unless the Drand operators are able to move their Drand
node to another IP / network that is not under attack. A halted chain means there
will not be any new Drand beacon for the number of rounds contained in `X`. Once
a threshold of nodes are back online, they will perform a "catch up" protocol to
produce the missing rounds as quickly as possible.

**Criteria for success**: The DoS attack must completely bring down the network
around a threshold of nodes. Completely means there is not a _single_ outgoing
partial beacon that leaves the Drand node's network. That is a _critical
distinction_ to make since, otherwise, a Drand node could still collect the
partial beacons of Drand nodes that are under attack, one by one. As soon as this node
gets a threshold of partial beacons, it can reconstruct the final beacon and broadcast it
to the relay network.

**Defense mechanism**: To counter DoS attacks, the Drand nodes must block the
incoming traffic as early as possible. To achieve that, allowing traffic only
from other Drand nodes and trusted relay nodes based on their IP addresses seems
the most efficient way to deal with DoS attacks.

**Potential additional defense mechanism**: Assuming the last criteria is not
met (it seems to be quite difficult to put in practice), there still needs to be
at least one Drand node that is not under attack to aggregate the partial
beacons. To increase the chance of reconstructing the final random beacon from
the partial beacons that "leak" out from Drand nodes under attack, it could
also be possible to setup aggregator nodes. Such nodes could be under heavy
protection, potentially with a more centralized governance, whose job is only
to collect the different partial beacons and aggregate them to deliver them to
the relay network. There could be many such aggregator nodes such that the
chance of getting at least one of these receiving enough threshold beacons
drastically increases.

#### Corruption of the Drand network

**Scenario #1**: Corruption of fewer than a threshold of nodes

In this scenario, the attacker corrupts _less_ than a threshold of Drand nodes.

_Consequence_: The attacker is _not_ able to derive any meaningful
information with respect to beacon chain (i.e. they can't derive future beacons).
However, it is assumed that the attacker now has access to the long term private
key of each compromised node.

**Scenario #2**: Corruption of more than a threshold of nodes

In this scenario, the threat model of Drand is now violated and thus this is the
scenario to avoid at all costs: the attacker corrupts _at least_ a threshold of
Drand nodes.

_Consequence_: The attacker is now able to derive the whole chain,
i.e. it can derive any given random beacon of the chain. The Drand randomness is
not _unpredictable_ anymore from the point of view of the attacker. However,
the Drand randomness stays _unbiasable_: the attacker is not able to change the
randomness in any way.

**Mitigation**: Proactive resharing allows both to:

1. Let a new group of nodes take over the randomness generation, potentially
   with more nodes and a higher threshold.
2. Refresh shares for nodes that participate in the resharing in the new group:
   partial beacons created from an old share are not validated by the members of
   the new group.

Given a "periodical" resharing with more nodes, it is more difficult for an
attacker to maintain their grasp on the shares of the Drand nodes, since they must
have continuous control over the Drand node itself. If the operator of a
corrupted Drand node recovers from the attacker's intrusion, after a resharing,
the attacker's stolen share is invalid. Moreover, a resharing with more nodes raises
the bar for the attacker to attain the second scenario, both because of the
previous argument and because attacker needs now to corrupt more nodes than in
the initial group in order to have the required threshold of shares.

As such, it is recommended to reshare often, _even if_ the group membership is
unchanged, as resharing creates new shares for all existing nodes and reduces
the potential impact of a stolen private share.

### Distributed Key Generation Ceremony

#### DoS attacks

If during the DKG, some nodes are DoS attacked, then these nodes might not be
able to receive the deals (shares) in time and / or reply in the second phase in
time. Given the necessity of time for achieving the synchronous network
assumption, that means these nodes risk getting excluded from the final group
that gets shares at the end.

**Practical Remediation**: At the end of a DKG, the nodes that successfully ran the
DKG are the one listed on the final configuration file, noted as "qualified".
Given the low frequency of Drand nodes having to run a DKG, manual observation
of which nodes are in the final group can lead the participants to decide whether
to re-run a DKG / resharing or not.

#### Corruption attacks

**Scenario 1**: An attacker only "controls" less than a threshold of nodes. The
attacker can choose the private polynomial used to create the shares. The attacker can
influence the distribution of the private shares, but is believed to not be
able to bias the distribution of the randomness later on.

**Scenario 2**: An attacker controls more than a threshold of nodes during the
DKG. This scenario is similar to the scenario 2 for the randomness generation,
since even before the DKG: attacker can know before the end of the DKG the whole
randomness chain (since he can see the honest shares before sending them).

#### Broadcast Channel Assumption

Attacker is at least one node in the group and broadcasts inconsistent shares
and public polynomial to different parties. Given that Drand does not use a
_reliable_ broadcast channel, the attacker is able to send any shares over
different polynomials for example - see
[here](https://www.jcraige.com/vss-forgery) for one example of such an attack.
Note that the attacker could try to partition the set of honest nodes in two such that
each half would have consistent shares within itself but inconsistent with
respect to the other half.

**Consequence**: Shares can be inconsistent with each other, and in such cases,
nodes will not be able to verify partial beacons during the randomness
generation phase. Another more subtle scenario is that nodes finish the DKG
with half of the honest nodes having a distributed public key different than the
other half, a "split".

**Practical Observation**: After a DKG is setup, nodes (1) publish the
distributed public key they have and (2) start the randomness generation rounds.
The first step enables any third party to verify that the distributed public keys are
the same (it is in fact sufficient to verify a threshold of them are the same).
In (2), the chain will not be able to advance and therefore it becomes clear
that the DKG step went wrong. Given the DKG phase is run once in a while, it is
reasonable to assume nodes can restart the DKG phase in case things have gone
wrong.

**Remediation to keep assumption true - (not implemented yet)**: A practical step towards ensuring non
equivocation during the DKG phase is to move to a libp2p pubsub overlay to be close to the reliable broadcast assumption. Indeed,
an attacker that would send different public polynomials is likely to end up as
not a qualified dealer since honest nodes would relay its packet and find the
inconsistency.

## To review

Drand must make sure that if a DKG went _wrong_ during a resharing because of
the broadcast channel assumption being violated, it keeps the previous share
to be able to start a new DKG again. Currently it erases the previous share
when DKG finishes. For a fresh DKG this is fine since nodes can restart from
scratch as before.
