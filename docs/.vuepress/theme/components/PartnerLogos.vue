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
        <div class="row">
          <a href="https://cloudflare.com/" class="logo" title="Cloudflare">
            <img
              src="/images/loe/logo-cloudflare.svg"
              alt="Cloudflare logo"
              class="wide"
            />
          </a>
          <a href="https://www.zengo.com/" class="logo" title="ZenGo">
            <img
              src="/images/loe/logo-zengo.png"
              alt="ZenGo logo"
              class="wide"
            />
          </a>
          <a
            href="https://ethereum.foundation/"
            class="logo"
            title="Ethereum Foundation"
          >
            <img
              src="/images/loe/logo-eth.png"
              alt="Ethereum Foundation logo"
            />
          </a>
          <a href="https://tierion.com/" class="logo" title="Tierion">
            <img
              src="/images/loe/logo-tierion.svg"
              alt="Tierion logo"
              class="wide"
            />
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
        </div>
        <div class="row">
          <a href="http://clabs.org/" class="logo" title="cLabs">
            <img
              src="/images/loe/logo-clabs.png"
              alt="cLabs logo"
              class="wide"
            />
          </a>
          <a href="https://theqrl.org/" class="logo" title="QRL">
            <img src="/images/loe/logo-qrl.svg" alt="QRL logo" class="narrow" />
          </a>
          <a
            href="https://www.uchile.cl/"
            class="logo"
            title="University of Chile"
          >
            <img
              src="/images/loe/logo-uchile.png"
              alt="University of Chile logo"
              class="wide"
            />
          </a>
          <a href="https://chainsafe.io/" class="logo" title="ChainSafe">
            <img src="/images/loe/logo-chainsafe.svg" alt="ChainSafe logo" />
          </a>
          <a
            href="https://www.c4dt.org/"
            class="logo"
            title="Center for Digital Trust"
          >
            <img
              src="/images/loe/logo-c4dt.svg"
              alt="Centre for Digital Trust logo"
            />
          </a>
        </div>
        <div class="row">
          <a href="https://ptisp.pt/" class="logo" title="PTisp">
            <img
              src="/images/loe/logo-ptisp.png"
              alt="PTisp logo"
              class="wide"
            />
          </a>
          <a
            href="https://www.epfl.ch/labs/dedis/"
            class="logo"
            title="EPFL - Decentralized and Distributed Systems Laboratory"
          >
            <img
              src="/images/loe/logo-epfl.svg"
              alt="EPFL - Decentralized and Distributed Systems Laboratory logo"
              class="wide"
            />
          </a>
          <a href="https://www.initc3.org/" class="logo" title="IC3">
            <img src="/images/loe/logo-ic3.png" alt="IC3 logo" />
          </a>
          <a href="https://protocol.ai/" class="logo" title="Protocol Labs">
            <img src="/images/loe/logo-pl.svg" alt="Protocol Labs logo" />
          </a>
          <a
            href="https://emeraldonion.org/"
            class="logo"
            title="Emerald Onion"
          >
            <img
              src="/images/loe/logo-emerald-onion.png"
              alt="Emerald Onion logo"
            />
          </a>
          <a href="https://www.ucl.ac.uk/" class="logo" title="UCL">
            <img src="/images/loe/logo-ucl.svg" alt="UCL logo" class="wide" />
          </a>
        </div>
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
  .logos .row
    display flex
    justify-content space-between
    flex-wrap wrap
  .logo
    display flex
    align-items center
    justify-content center
    background white
    margin 0.7rem 0.7rem 2rem
    width 150px
    height 80px
    text-align center
    transition: all .3s

    img
      max-width 120px
      max-height 60px
      &.wide // give wide images a bit more horizontal space
        max-width 140px
      &.narrow // give images a bit less horizontal space
        max-width 80px

  @media (min-width: $MQNarrow)
    .logos .row
      flex-wrap nowrap
</style>
