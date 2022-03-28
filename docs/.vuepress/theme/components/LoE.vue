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
          <a href="http://clabs.org/" class="logo" title="cLabs">
            <img
              src="/images/loe/logo-clabs.png"
              alt="cLabs logo"
              class="wide"
            />
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
              src="/images/loe/logo-c4dt.svg"
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
          <a href="https://www.initc3.org/" class="logo" title="IC3">
            <img src="/images/loe/logo-ic3.png" alt="IC3 logo" />
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
          <a href="https://ptisp.pt/" class="logo" title="PTisp">
            <img
              src="/images/loe/logo-ptisp.png"
              alt="PTisp logo"
              class="wide"
            />
          </a>
          <a href="https://theqrl.org/" class="logo" title="QRL">
            <img src="/images/loe/logo-qrl.svg" alt="QRL logo" class="narrow" />
          </a>
          <a href="https://tierion.com/" class="logo" title="Tierion">
            <img
              src="/images/loe/logo-tierion.svg"
              alt="Tierion logo"
              class="wide"
            />
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
        </div>
      </div>
    </div>
    <div class="button">
      <router-link
        :to="'/partner-with-us'"
        class="action-button reverse yellow"
      >
        Join the coalition!
      </router-link>
    </div>
    <div v-if="!error" class="history">
      <h3>Latest Randomness</h3>
      <p>
        Here's the latest random value that was generated, round #<strong>{{
          round
        }}</strong
        >:
      </p>
      <p class="latest" :title="randomness">{{ randomness }}</p>
      <p>
        The next randomness is expected in
        <strong class="eta">{{ eta }} seconds</strong>.
      </p>
      <p>
        Learn how to retrieve randomness from the League of Entropy drand
        nodes:<br /><router-link to="/developer/" class="action-button"
          >Developer Docs</router-link
        >
      </p>
    </div>
    <div v-if="error" class="history">
      <h3>Latest Randomness</h3>
      <p>
        <span style="color: yellow">⚠️</span> An error occurred loading the
        latest randomness:
      </p>
      <p class="error">Error: {{ error.message }}</p>
      <p>
        Check the <a href="https://drand.statuspage.io/">network status</a> for
        information on outages and planned maintenance.
        <a href="https://github.com/drand/drand/issues/new"
          >Report this problem</a
        >.
      </p>
    </div>
  </article>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'
import Client, { HTTP } from 'drand-client'

const CHAIN_HASH =
  '8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce'
const URLS = [
  'https://api.drand.sh',
  'https://api2.drand.sh',
  'https://api3.drand.sh',
  'https://drand.cloudflare.com'
]

const chars = '0123456789abcdef'
const randomChar = () => chars[Math.floor(Math.random() * chars.length)]
const randomChars = num => Array.from(Array(num), randomChar).join('')

export default {
  name: 'LoE',

  data: () => ({ round: 0, eta: 0, randomness: '', error: null }),

  async mounted() {
    try {
      const client = await Client.wrap(HTTP.forURLs(URLS, CHAIN_HASH), {
        chainHash: CHAIN_HASH
      })

      const info = await client.info()

      const nextRoundETA = () => {
        const now = Date.now()
        const round = client.roundAt(now)
        const time = info.genesis_time * 1000 + round * info.period * 1000
        return Math.round((time - now) / 1000)
      }

      this.intervalID = setInterval(() => {
        this.eta = nextRoundETA()
      }, 100)
      this.aborter = new AbortController()

      for await (const res of client.watch({ signal: this.aborter.signal })) {
        this.round = res.round
        let nextRandomness = ''
        const delay = 10
        for (let i = 0; i < res.randomness.length + delay; i++) {
          setTimeout(() => {
            if (i < delay) {
              this.randomness = randomChars(64)
            } else {
              nextRandomness += res.randomness[i - delay]
              this.randomness =
                nextRandomness + randomChars(64 - nextRandomness.length)
            }
          }, i * 25)
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err)
        this.error = err
      }
    }
  },

  beforeDestroy() {
    clearInterval(this.intervalID)
    if (this.aborter) {
      this.aborter.abort()
    }
  }
}
</script>

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
