<template>
  <article class="loe">
    <header>
      <h2 title="League of Entropy">
        <img src="/images/logo-loe.png" alt="League of Entropy logo" />
      </h2>
      <p>
        The <strong>League of Entropy</strong> is a collaborative project
        between the founding members <strong>Cloudflare</strong>,
        <strong>École polytechnique fédérale de Lausanne</strong>,
        <strong>Kudelski Security</strong>, <strong>Protocol Labs</strong>, and
        <strong>University of Chile</strong> to provide a verifiable,
        decentralized randomness beacon for anyone that may need a public source
        of randomness.
      </p>
    </header>
    <div class="history">
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
        <strong class="next-round-time">{{ nextRoundTime }} seconds</strong>.
      </p>
      <p>
        Learn how to retrieve randomness from the League of Entropy drand
        nodes:<br /><router-link to="/developer/" class="action-button"
          >Developer Docs</router-link
        >
      </p>
    </div>
  </article>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'

// TODO: import drandjs

const genesis = 1590032610 * 1000 // Genesis time in ms (provided in seconds from drand)
const period = 30 * 1000 // Period in ms (provided in seconds from drand)

const currentRound = (genesis, period) =>
  Math.floor((Date.now() - genesis) / period)

const nextRoundInfo = (genesis, period) => {
  const round = currentRound(genesis, period) + 1
  return { time: genesis + round * period, round }
}

const chars = '0123456789abcdef'
const randomChar = () => chars[Math.floor(Math.random() * chars.length)]
const randomChars = num => Array.from(Array(num), randomChar).join('')

const client = {
  watch: options => ({
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
            randomness: randomChars(64)
          }
        }
      }
      return new Promise((resolve, reject) => {
        const nextInfo = nextRoundInfo(genesis, period)
        const timeoutID = setTimeout(() => {
          options.signal.removeEventListener('abort', onAbort)
          resolve({
            value: { round: nextInfo.round, randomness: randomChars(64) }
          })
        }, nextInfo.time - Date.now())

        const onAbort = () => {
          clearTimeout(timeoutID)
          resolve({ done: true })
        }

        options.signal.addEventListener('abort', onAbort)
      })
    }
  })
}

export default {
  name: 'LoE',

  data: () => ({
    round: currentRound(),
    nextRoundTime: 0,
    randomness: randomChars(64)
  }),

  mounted() {
    this.intervalID = setInterval(() => {
      const nextInfo = nextRoundInfo(genesis, period)
      this.nextRoundTime = Math.round((nextInfo.time - Date.now()) / 1000)
    }, 100)

    this.aborter = new AbortController()

    const watch = async () => {
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
    }

    watch()
  },

  beforeDestroy() {
    clearInterval(this.intervalID)
    this.aborter.abort()
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
        font-family 'Courier New', Courier, monospace
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        border-radius 3px
        max-width: 60rem
        box-shadow 2px 2px 5px #2d3393
      .next-round-time
        white-space nowrap
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

@media (min-width: $MQNarrow)
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
