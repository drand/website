<template>
  <article class="loe">
    <div>
      <header>
        <h2 title="League of Entropy">
          <a href="https://blog.cloudflare.com/league-of-entropy/"
            ><img src="/images/logo-loe.png" alt="League of Entropy logo"
          /></a>
        </h2>
        <p>
          The
          <a href="https://blog.cloudflare.com/league-of-entropy/"
            ><strong>League of Entropy</strong></a
          >
          is a collaborative project to provide a verifiable, decentralized
          randomness beacon for anyone that may need a public source of
          randomness.
        </p>
      </header>
      <div class="members">
        <h3>Members</h3>
        <div class="logos">
          <a href="https://chainsafe.io/" class="logo" title="ChainSafe">
            <img src="/images/loe/logo-chainsafe.svg" alt="ChainSafe logo" />
          </a>
          <a href="https://cloudflare.com/" class="logo" title="Cloudflare">
            <img
              src="/images/loe/logo-cloudflare.svg"
              alt="Cloudflare logo"
              class="wide"
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
          <a href="https://www.diadata.org/" class="logo" title="DIA">
            <img src="/images/loe/logo-dia.png" alt="DIA logo" />
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
          <a href="https://protocol.ai/" class="logo" title="Protocol Labs">
            <img src="/images/loe/logo-pl.svg" alt="Protocol Labs logo" />
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
          <a href="https://www.ucl.ac.uk/" class="logo" title="UCL">
            <img src="/images/loe/logo-ucl.svg" alt="UCL logo" class="wide" />
          </a>
          <a href="https://www.storswift.com/" class="logo" title="StorSwift">
            <img
              src="/images/loe/storswift-logo.png"
              alt="StorSwift logo"
              class="wide"
            />
          </a>
          <a href="https://forcecommunity.io/" class="logo" title="IPFS Force">
            <img
              src="/images/loe/logo-IPFSForce.svg"
              alt="IPFSForce logo"
              class="wide"
            />
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
        </div>
      </div>
    </div>
    <div class="button">
      <router-link
        :to="'/loe'"
        class="action-button reverse yellow"
      >
        Join the coalition!
      </router-link>
    </div>
  </article>
</template>

<style lang="stylus">
.loe
  margin 3rem auto
  padding 6rem 2rem
  background-color #1477c6
  background linear-gradient(to bottom, #069de2 0%,#2d3393 100%)
  text-align center
  color white
  h2
    border 0
    margin 0
    padding 0
    img
      width 512px
      max-width 100%
  strong
    font-size 1.2rem
    line-height 1.6
  a
    color white
    &.reverse.action-button
      display inline-block
      font-size 1.2rem
      text-decoration none
      color #1477c6
      background-color #fff
      margin 3rem 0 5rem
      padding 0.8rem 1.6rem
      min-width 8rem
      border-radius 4px
      transition background-color .1s ease
      box-sizing border-box
      border 2px solid white
      box-shadow 4px 4px 0 #ffde52
      text-align center
      &:hover
          opacity .9
  .members
    .logos
      display flex
      justify-content center
      flex-wrap wrap
    .logo
      display flex
      align-items center
      justify-content center
      background white
      margin 0.7rem
      width 80px
      height 80px
      border-radius 50%
      text-align center
      box-shadow 2px 2px 5px #2d3393
      transition: box-shadow 1s
      &:hover
        box-shadow 4px 4px 5px #2d3393
      img
        max-width 50px
        max-height 50px
        &.wide // give wide images a bit more horizontal space
          max-width 60px
        &.narrow // give images a bit less horizontal space
          max-width 140px
  .history
      h3
        font-size 2rem
      a
        text-decoration underline
      .latest
        background white
        margin 0 auto
        padding 1rem
        color #1266b4
        font-size 1.5rem
        font-weight bold
        font-family 'Courier New', Courier, monospace
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        border-radius 3px
        max-width: 60rem
        box-shadow 2px 2px 5px #2d3393
      .eta
        white-space nowrap
      .action-button
        display inline-block
        font-size 1.2rem
        text-decoration none
        color #fff
        background-color #1477c6
        margin 1rem
        padding 0.8rem 1.6rem
        min-width 8rem
        border-radius 50px
        transition background-color .1s ease
        box-sizing border-box
        border 2px solid white
        box-shadow 2px 2px 5px #2d3393
        text-align center
        &:hover
            background-color #0f86d1
      .error
        font-family 'Courier New', Courier, monospace
        word-break break-word

@media (min-width: $MQNarrow)
  .loe
    padding 6rem
    div:first-child
      display flex
      align-items center
      align-content stretch
      justify-content space-evenly
      p
        text-align left
      header, .members
        max-width 512px
      .members
        h3
          margin-top: 0
</style>
