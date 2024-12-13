<template>
  <article class="our-partners">
    <div class="members">
      <h3>Our partners</h3>
      <p>
        Many leading computing organizations are already collaborating with us
        on this important project.
        <a href="#">Join them →</a>
      </p>
      <div class="logos">
        <a href="https://cloudflare.com/" class="logo" title="Cloudflare">
          <img
            src="/images/loe/logo-cloudflare.svg"
            alt="Cloudflare logo"
            class="wide"
          />
        </a>
        <a
          href="https://ethereum.foundation/"
          class="logo"
          title="Ethereum Foundation"
        >
          <img src="/images/loe/ef-logo.png" alt="Ethereum Foundation logo" />
        </a>
        <a
          href="https://www.kudelskisecurity.com/"
          class="logo"
          title="Kudelski Security"
        >
          <img
            src="/images/loe/logo-kudelski-security.png"
            alt="Kudelski Security logo"
            class="wide"
          />
        </a>
        <a href="https://theqrl.org/" class="logo" title="QRL">
          <img src="/images/loe/logo-qrl.svg" alt="QRL logo" class="narrow" />
        </a>
        <a
          href="https://www.ata.network/"
          class="logo"
          title="Automata Network"
        >
          <img
            src="/images/loe/ata-network.png"
            alt="Automata Network logo"
            class="wide"
          />
        </a>
        <a
          href="https://www.uchile.cl/"
          class="logo"
          title="University of Chile"
        >
          <img
            src="/images/loe/universidad-de-chile-logo-vector.png"
            alt="University of Chile logo"
            class="wide"
          />
        </a>
        <a href="https://chainsafe.io/" class="logo" title="ChainSafe">
          <img
            src="/images/loe/chainsafe-chainbridge-500.png"
            alt="ChainSafe logo"
          />
        </a>
        <a
          href="https://www.c4dt.org/"
          class="logo"
          title="Center for Digital Trust"
        >
          <img
            src="/images/loe/c4dt-logo.png"
            alt="Centre for Digital Trust logo"
          />
        </a>
        <a href="https://www.diadata.org/" class="logo" title="DIA">
          <img src="/images/loe/logo-dia.png" alt="DIA logo" />
        </a>
        <a
          href="https://www.epfl.ch/labs/dedis/"
          class="logo last-row"
          title="EPFL - Decentralized and Distributed Systems Laboratory"
        >
          <img
            src="/images/loe/logo-epfl.svg"
            alt="EPFL - Decentralized and Distributed Systems Laboratory logo"
            class=""
          />
        </a>
        <a href="https://www.initc3.org/" class="logo last-row" title="IC3">
          <img
            src="/images/loe/initiative-for-ccandc-logo.png"
            alt="IC3 logo"
            class="narrow"
          />
        </a>
        <a
          href="https://protocol.ai/"
          class="logo last-row"
          title="Protocol Labs"
        >
          <img
            src="/images/loe/protocol-labs-logo.png"
            alt="Protocol Labs logo"
          />
        </a>
        <a
          href="https://emeraldonion.org/"
          class="logo last-row"
          title="Emerald Onion"
        >
          <img
            src="/images/loe/logo-emerald-onion.png"
            alt="Emerald Onion logo narrow"
          />
        </a>
        <a href="https://www.ucl.ac.uk/" class="logo last-row" title="UCL">
          <img src="/images/loe/logo-ucl.svg" alt="UCL logo" class="" />
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
.our-partners
  max-width 1100px
  margin auto auto
  padding 0 1.2rem
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
