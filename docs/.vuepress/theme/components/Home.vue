<template>
  <main class="home" aria-labelledby="main-title">
    <header class="hero">
      <img
        v-if="data.heroImage"
        :src="$withBase(data.heroImage)"
        :alt="data.heroAlt || 'hero'"
      />
      <div>
        <h1 v-if="data.heroText !== null" id="main-title">
          {{ data.heroText || $title || 'Hello' }}
        </h1>

        <p v-if="data.tagline !== null" class="description">
          {{ data.tagline || $description || 'Welcome to your VuePress site' }}
        </p>

        <p v-if="data.actionText && data.actionLink" class="action">
          <NavLink class="action-button" :item="actionLink" />
        </p>
      </div>
    </header>

    <div v-if="data.features && data.features.length" class="features">
      <div
        v-for="(feature, index) in data.features"
        :key="index"
        class="feature"
      >
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.details }}</p>
        <div v-if="feature.actions && feature.actions.length" class="actions">
          <template v-for="(action, index) in feature.actions">
            <router-link :to="action.link" class="action-button">{{
              action.text
            }}</router-link>
          </template>
        </div>
      </div>
    </div>

    <article class="loe">
      <header>
        <h2 title="League of Entropy">
          <img src="/images/logo-loe.png" alt="League of Entropy logo" />
        </h2>
        <p>
          The <strong>League of Entropy</strong> is a collaborative project
          between the founding members <strong>Cloudflare</strong>,
          <strong>École polytechnique fédérale de Lausanne</strong>,
          <strong>Kudelski Security</strong>, <strong>Protocol Labs</strong>,
          and <strong>University of Chile</strong> to provide a verifiable,
          decentralized randomness beacon. A decentralized randomness beacon
          combines randomness from multiple independent high entropy sources to
          generate a truly unbiased random number for anyone that may need a
          public source of randomness.
        </p>
      </header>
      <div class="history">
        <h3>Latest Randomness</h3>
        <p>
          Here's the latest random value that was generated, round #<strong
            class="round"
            >0</strong
          >:
        </p>
        <p class="latest"></p>
        <p>
          The next randomness is expected in
          <strong><span class="secs">0</span> seconds</strong>.
        </p>
        <p>
          Learn how to retrieve randomness from the League of Entropy drand
          nodes:<br /><router-link to="/docs" class="action-button"
            >API Docs</router-link
          >
        </p>
      </div>
    </article>

    <Content class="theme-default-content custom" />

    <div v-if="data.footer" class="footer">
      {{ data.footer }}
    </div>
  </main>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'

async function startLOERandomness() {
  // TODO: import drandjs

  const genesis = 1590032610 * 1000 // Genesis time in ms (provided in seconds from drand)
  const period = 30 * 1000 // Period in ms (provided in seconds from drand)

  const roundEl = document.querySelector('.history .round')
  const secsEl = document.querySelector('.history .secs')
  const latestEl = document.querySelector('.history .latest')

  const currentRound = (genesis, period) =>
    Math.floor((Date.now() - genesis) / period)

  const nextRoundInfo = (genesis, period) => {
    const round = currentRound(genesis, period) + 1
    return { time: genesis + round * period, round }
  }

  setInterval(() => {
    const nextInfo = nextRoundInfo(genesis, period)
    const secs = Math.round((nextInfo.time - Date.now()) / 1000)
    secsEl.textContent = secs
  }, 100)

  const fakeRandomness = () => {
    const chars = '0123456789abcdef'
    return Array.from(
      Array(64),
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  }

  const client = {
    watch: () => ({
      [Symbol.asyncIterator]() {
        return this
      },
      first: true,
      next() {
        if (this.first) {
          this.first = false
          return {
            value: {
              round: currentRound(genesis, period),
              randomness: fakeRandomness()
            }
          }
        }
        return new Promise((resolve, reject) => {
          const nextInfo = nextRoundInfo(genesis, period)
          setTimeout(() => {
            resolve({
              value: { round: nextInfo.round, randomness: fakeRandomness() }
            })
          }, nextInfo.time - Date.now())
        })
      }
    })
  }

  for await (const res of client.watch()) {
    roundEl.textContent = res.round
    latestEl.textContent = res.randomness
    latestEl.setAttribute('title', res.randomness)
  }
}

setTimeout(startLOERandomness, 1000)

export default {
  name: 'Home',

  components: { NavLink },

  computed: {
    data() {
      return this.$page.frontmatter
    },

    actionLink() {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    }
  }
}
</script>

<style lang="stylus">
.home
  display block
  .hero
    background #0B1232
    padding 3rem
    text-align center
    img
      display block
      width 232px
      max-width 100%
      margin 2rem auto
    > div
      margin 0 1rem
    h1
      margin 0 0 .5rem 0
      font-size 2rem
      font-style italic
      color white
    .description
      margin .5rem auto 1rem auto
      max-width 35rem
      font-size 1.6rem
      line-height 1.3
      color white
  .features
    max-width $homePageWidth
    margin auto auto
    padding 0 1.2rem
  .feature
    margin 3rem auto
    h2
      font-size 2rem
      border-bottom none
      padding-bottom 0
      font-style italic
    p
      margin 2rem auto
    .action-button
      display inline-block
      font-size 1.2rem
      color #fff
      background-color $accentColor
      margin-right 1rem
      padding 0.8rem 1.6rem
      min-width 8rem
      border-radius 4px
      transition background-color .1s ease
      box-sizing border-box
      border-bottom 1px solid darken($accentColor, 10%)
      box-shadow #FF3956 4px 4px 0px
      text-align center
      &:nth-child(even)
        box-shadow #FFDE52 4px 4px 0px
      &:hover
        background-color lighten($accentColor, 10%)
  .loe
    margin 3rem auto
    padding 6rem 1.2rem
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
    .history
      h3
        font-size 2rem
      .latest
        background white
        margin 0 auto
        padding 1rem
        color #1266b4
        font-size 1.5rem
        font-weight bold
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        border-radius 3px
        max-width: 60rem
        box-shadow 2px 2px 5px #2d3393
      .action-button
        display inline-block
        font-size 1.2rem
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
  .theme-default-content
    max-width $homePageWidth
    margin 0px auto
  .footer
    max-width $homePageWidth
    margin 0px auto
    padding 2.5rem
    border-top 1px solid $borderColor
    text-align center
    color lighten($textColor, 25%)

@media (min-width: $MQNarrow)
  .home
    .hero
      display flex
      align-items center
      justify-content center
      background #0B1232 url(/images/bg-hero.jpg) no-repeat center center
      background-size cover
      padding: 7rem 0
      text-align left
      img
        flex none
        margin 0 1rem
      > div
        flex none
        padding-bottom 3.65rem
    .features
      display flex
      flex-wrap wrap
      align-items flex-start
      align-content stretch
      justify-content space-between
    .feature
      flex-grow 1
      flex-basis 48%
      max-width 48%
    .loe
      padding 6rem
      header
        display flex
        align-items center
        align-content stretch
        justify-content space-evenly
        p
          text-align left
        h2, p
          flex-grow 1
          flex-basis 50%
          max-width 512px
</style>
