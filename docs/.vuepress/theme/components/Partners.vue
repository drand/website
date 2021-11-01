<template>
  <main class="partners" aria-labelledby="main-title">
    <header class="hero">
      <div class="hero-content">
        <div class="images">
          <img
            width="170px"
            v-if="data.heroImage"
            :src="$withBase(data.heroImage)"
            :alt="data.heroAlt || 'hero'"
          />
          <img
            width="286px"
            v-if="data.heroImage2"
            :src="$withBase(data.heroImage2)"
            :alt="data.hero2Alt || 'hero2'"
          />
        </div>
        <div>
          <h1 v-if="data.heroText !== null" id="main-title">
            {{ data.heroText || $title || 'Hello' }}
          </h1>

          <h2 v-if="data.tagline !== null" class="description">
            {{
              data.tagline || $description || 'Welcome to your VuePress site'
            }}
          </h2>

          <p v-if="data.actionText && data.actionLink" class="action">
            <NavLink class="action-button" :item="actionLink" />
          </p>
        </div>
      </div>
    </header>

    <div
      v-if="data.slideFeature && data.slideFeature.length"
      class="partners-slides"
    >
      <div
        v-for="(feature, index) in data.slideFeature"
        :key="index"
        class="feature"
      >
        <div class="left">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.details }}</p>
          <div v-if="feature.actions && feature.actions.length" class="actions">
            <template v-for="(action, index) in feature.actions">
              <a :href="action.link" class="action-button"> Learn now </a>
            </template>
          </div>
        </div>
        <div class="right">
          <img
            width="550px"
            v-if="feature.image"
            :src="$withBase(feature.image)"
            :alt="'slide screenshot'"
          />
        </div>
      </div>
    </div>

    <PartnerLogos />

    <div v-if="data.detailsText && data.detailsText.length" class="details">
      <h3>{{ data.featureIntro }}</h3>
      <div
        v-for="(feature, index) in data.detailsText"
        :key="index"
        class="detail"
      >
        <h4>{{ feature.heading }}</h4>
        <p>{{ feature.paragraph }}</p>
      </div>
      <div
        v-for="(feature, index) in data.features"
        :key="index"
        class="feature"
      >
        <p>{{ feature.info }}</p>
      </div>
      <div v-if="data.guidelinesLink || data.recommendationsLink">
        Find out more about the
        <a :href="data.guidelinesLink">Operatior Guidelines</a>
        and the
        <a :href="data.recommendationsLink"
          >Recommendations for drand Operators →</a
        >
      </div>
    </div>

    <Content class="theme-default-content custom" />
    <div class="form-button text-center">
      <a :href="data.getStartedLink" class="action-button yellow">
        Join the coalition
      </a>
    </div>

    <Content class="footer" slot-key="footer" />
  </main>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'
import PartnerLogos from '../components/PartnerLogos.vue'

export default {
  name: 'Partners',

  components: {
    NavLink,
    PartnerLogos
  },

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
.partners
  display block
  h2
    font-size 2rem
    border-bottom none
    padding-bottom 0
    font-style italic
  .hero
    text-align center
    img
      display block
      max-width 100%
      margin 3rem auto 2rem
    > div
      margin 0 1rem
    h1
      color black
      margin 0 0 .5rem 0
      font-size 4rem
      font-style italic
    .description
      margin .5rem auto 1rem auto
      max-width 35rem
      font-size 2rem
      line-height 1.3
      color black
  .details
    max-width 1100px
    margin auto auto
    padding 0 1.2rem
  .hero-content
    max-width 1100px
    margin auto auto
    padding 0 1.2rem
  .feature
    margin 3rem auto
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
  .partners-slides
    background #f2f2f2
    max-width 1100px
    margin auto auto
    padding 0 1.2rem
  .theme-default-content
    max-width $homePageWidth
    margin 3rem auto
    padding 0 2rem
  .footer
    max-width $homePageWidth
    margin 0px auto
    padding 2.5rem
    border-top 1px solid $borderColor
    text-align center
    color lighten($textColor, 25%)
    p:first-child
      margin-top 0

@media (min-width: $MQNarrow)
  .partners
    .hero
      display flex
      align-items center
      justify-content center
      background url(/images/hero-background-partners.jpg) no-repeat top center
      background-size 100%
      text-align left
      .hero-content
        display flex
        flex-direction row
        justify-content space-between
        align-items center
        margin-top 80px
      .images
        width 35%
        padding-right 60px
      img
        flex none
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
</style>
