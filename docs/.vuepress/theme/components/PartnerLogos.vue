<template>
  <article class="our-partners">
    <div class="members">
      <h3>Our partners</h3>
      <p>
        Discover the League of Entropy (LoE), a coalition dedicated to delivering publicly verifiable decentralized
        randomness.
        Many leading computing organizations are already collaborating with us
        on this important project. <br />
        Join us!
      </p>
      <h4 class="partners-header">Mainnet members</h4>
      <p class="members-details">Mainnet members are actively operating a mainnet node for the League of Entropy, helping produce verifiable public randomness.</p>
      <div class="logos">
        <a href="https://cloudflare.com/" class="logo" title="Cloudflare">
          <img src="/images/loe/logo-cloudflare.svg" alt="Cloudflare logo" class="wide" />
        </a>
        <a href="https://ethereum.foundation/" class="logo" title="Ethereum Foundation">
          <img src="/images/loe/ef-logo.png" alt="Ethereum Foundation logo" />
        </a>
        <a href="https://www.kudelskisecurity.com/" class="logo" title="Kudelski Security">
          <img src="/images/loe/logo-kudelski-security.png" alt="Kudelski Security logo" class="wide" />
        </a>
        <a href="https://theqrl.org/" class="logo" title="QRL">
          <img src="/images/loe/logo-qrl.svg" alt="QRL logo" class="narrow" />
        </a>
        <a href="https://www.ata.network/" class="logo" title="Automata Network">
          <img src="/images/loe/ata-network.png" alt="Automata Network logo" class="wide" />
        </a>
        <a href="https://www.uchile.cl/" class="logo" title="University of Chile">
          <img src="/images/loe/universidad-de-chile-logo-vector.png" alt="University of Chile logo" class="wide" />
        </a>
        <a href="https://chainsafe.io/" class="logo" title="ChainSafe">
          <img src="/images/loe/chainsafe-chainbridge-500.png" alt="ChainSafe logo" />
        </a>
        <a href="https://www.c4dt.org/" class="logo" title="Center for Digital Trust">
          <img src="/images/loe/c4dt-logo.png" alt="Centre for Digital Trust logo" />
        </a>
        <a href="https://www.diadata.org/" class="logo" title="DIA">
          <img src="/images/loe/logo-dia.png" alt="DIA logo" />
        </a>
        <a href="https://www.epfl.ch/labs/dedis/" class="logo last-row"
          title="EPFL - Decentralized and Distributed Systems Laboratory">
          <img src="/images/loe/logo-epfl.svg" alt="EPFL - Decentralized and Distributed Systems Laboratory logo"
            class="" />
        </a>
        <a href="https://www.initc3.org/" class="logo last-row" title="IC3">
          <img src="/images/loe/initiative-for-ccandc-logo.png" alt="IC3 logo" class="narrow" />
        </a>
        <a href="https://protocol.ai/" class="logo last-row" title="Protocol Labs">
          <img src="/images/loe/protocol-labs-logo.png" alt="Protocol Labs logo" />
        </a>
        <a href="https://emeraldonion.org/" class="logo last-row" title="Emerald Onion">
          <img src="/images/loe/logo-emerald-onion.png" alt="Emerald Onion logo narrow" />
        </a>
        <a href="https://www.ucl.ac.uk/" class="logo last-row" title="UCL">
          <img src="/images/loe/logo-ucl.svg" alt="UCL logo" class="" />
        </a>
        <a href="https://forcecommunity.io/" class="logo last-row" title="IPFS Force">
          <img src="/images/loe/logo-IPFSForce.svg" alt="IPFSForce logo" class="" />
        </a>
      </div>
      <h4 class="partners-header">Testnet members</h4>
      <p class="members-details">Testnet members are prospective mainnet members who are showcasing their operational excellence in order to graduate to Mainnet.</p>
        <div class="logos">
          <a href="https://www.hslu.ch/en/" class="logo" title="Lucerne University of Applied Sciences and Arts">
            <img src="/images/loe/logo-hslu.png" alt="Lucerne University of Applied Sciences and Arts" class="" />
          </a>
          <a href="https://www.upc.edu/en" class="logo" title="Polytechnic University of Catalonia">
            <img src="/images/loe/logo-upc.svg" alt="Polytechnic University of Catalonia" class="" />
          </a>
          <a href="https://zkv.xyz/" class="logo" title="ZKV">
            <img src="/images/loe/logo-zkv.jpg" alt="ZKV" class="" />
          </a>
        </div>

        <h4 class="partners-header">Alumni</h4>
        <p style="font-size: 1em;">Alumni are former League members and partners. We are grateful for their help to make the internet a fairer place.</p>
          <div class="logos">
            <a href="https://www.initc3.org/" class="logo" title="IC3">
              <img src="/images/loe/logo-ic3.png" alt="IC3 logo" />
            </a>
            <a href="https://tierion.com/" class="logo" title="Tierion">
              <img src="/images/loe/tierion-logo.png" alt="Tierion logo" class="wide" />
            </a>
            <a href="https://www.zengo.com/" class="logo" title="ZenGo">
              <img src="/images/loe/logo-zengo.png" alt="ZenGo logo" class="wide" />
            </a>
            <a href="http://clabs.org/" class="logo" title="cLabs">
              <img src="/images/loe/c-labs-logo.png" alt="cLabs logo" class="wide" />
            </a>
            <a href="https://ptisp.pt/" class="logo" title="PTisp">
              <img src="/images/loe/logo-ptisp.png" alt="PTisp logo" class="wide" />
            </a>
          </div>
    </div>
  </article>
</template>

<script>
  export default {
    name: 'PartnerLogos'
  }
</script>

<style lang="stylus">
.partners-header
  margin-top: 0px;
  margin-bottom: 1em;
  line-height: 1;

.our-partners
  max-width 1100px
  margin auto auto
  padding 0 1.2rem
  .members-details
    font-size: 1em;
    line-height: 1;
    margin-top: 0px;
    margin-bottom: 0px;
  .members
    padding 1rem
  .logos
    display flex
    justify-content space-between
    flex-wrap wrap
  .logo
    display flex
    align-items center
    justify-content center
    background white
    margin 0.7rem 0.7rem 0
    width 25%
    height 80px
    text-align center
    transition: all .3s

    img
      max-width 100%
      max-height 40px

  @media (min-width: $MQNarrow)
    p
      font-size 1.5rem
    .logo
      margin 0.7rem 0.7rem 2rem
      width 17%
      &.last-row
        width 14%
      img
        max-width 120px
        max-height 60px
        &.wide // give wide images a bit more horizontal space
          max-width 140px
        &.narrow // give images a bit less horizontal space
          max-width 100px
          max-height 50px
</style>