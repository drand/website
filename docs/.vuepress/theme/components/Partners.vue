<template>
  <main class="partners" aria-labelledby="main-title">
    <header class="hero">
      <div class="hero-content">
        <div class="images">
          <div class="img-holder">
            <img
              width="170px"
              v-if="data.heroImage"
              :src="$withBase(data.heroImage)"
              :alt="data.heroAlt || 'hero'"
            />
          </div>
          <div class="img-holder">
            <img
              width="286px"
              v-if="data.heroImage2"
              :src="$withBase(data.heroImage2)"
              :alt="data.hero2Alt || 'hero2'"
            />
          </div>
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
        <div class="right">
          <img
            width="100%"
            v-if="feature.image"
            :src="$withBase(feature.image)"
            :alt="'slide screenshot'"
          />
        </div>

        <div class="left">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.details }}</p>
          <p>{{ feature.details2 }}</p>
          <div v-if="feature.actions && feature.actions.length" class="actions">
            <template v-for="(action, index) in feature.actions">
              <a :href="action.link" class="action-button" target="_blank">
                {{ action.text }}
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>

    <PartnerLogos />

    <div v-if="data.detailsText && data.detailsText.length" class="details">
      <h3>{{ data.featureIntro }}</h3>
      <div class="detail-row">
        <div
          v-for="(feature, index) in data.detailsText"
          :key="index"
          class="detail"
        >
          <h4>{{ feature.heading }}</h4>
          <p>{{ feature.paragraph }}</p>
        </div>
      </div>
      <div class="detail-features">
        <div
          v-for="(feature, index) in data.features"
          :key="index"
          class="feature"
        >
          <p>{{ feature.info }}</p>
        </div>
      </div>
      <div v-if="data.guidelinesLink || data.recommendationsLink">
        Find out more about the
        <a :href="data.guidelinesLink">Operator Guidelines</a>
        and the
        <a :href="data.recommendationsLink"
          >Recommendations for drand Operators →</a
        >
      </div>
    </div>

    <Content class="theme-default-content custom" />
    <div class="form-button text-center">
      <a
        :href="data.getStartedLink"
        target="_blank"
        class="action-button yellow"
      >
        Join the league
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
  h1
  h2
  h3
    color #000
    font-style italic
  h2, h3
    font-size 2rem
    border-bottom none
    padding-bottom 0
    font-style italic
  h4
    color #000
    font-size 1.5rem
    margin-bottom 1.25rem
  p
    color #000
  .hero
    margin-bottom 4rem
    text-align center
    .hero-content
      max-width 1100px
      margin auto auto
      padding 0 1.2rem
      .images
        display flex
        flex-direction row
        align-content center
        justify-content center
        .img-holder
          align-items center
          display flex
          justify-content center
          padding 1rem
    img
      display block
      max-width 100%
      margin 3rem auto 2rem
    > div
      margin 0 1rem
    h1
      font-size 3rem
      font-style italic
      font-weight 700
      margin 0 auto 1rem
      max-width 62vw
      line-height: 1
    .description
      margin .5rem auto 1rem auto
      max-width 72vw
      font-size 1.5rem
      font-weight 400
      font-style normal
      line-height 1.2
  .details
    max-width 1068px
    margin auto auto
    padding 0 2.2rem
    .detail-features
      margin  2rem 0
      .feature
        background linear-gradient(75.79deg, #12339E 7.15%, #019EE2 78.96%);
        padding 1rem
        margin-bottom 1rem
        p
          padding 1rem
          color #FFF

  .action-button
    display block
    font-size 1.2rem
    color #fff
    background-color $accentColor
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
    padding 2rem

    .feature
      img
        box-shadow #FF3956 4px 4px 0px
      h3
        font-size 1.5rem
      p
        margin 2rem auto

  .theme-default-content
    max-width 1068px
    margin 3rem auto
    padding 0 2rem

  .form-button
    margin-bottom 4rem
    padding 0 2rem
    text-align center
    a.yellow
     box-shadow #FFDE52 4px 4px 0px
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
    h3
      font-size: 3rem;
      margin: 0 0 .5rem;
    .hero
      display flex
      align-items center
      justify-content center
      background url(/images/hero-background-partners.jpg) no-repeat top center
      background-size 100%
      text-align left
      h1
        font-size 4rem
      .hero-content
        display flex
        flex-direction row
        justify-content space-between
        align-items center
        margin-top 80px

        .images
          flex-direction column
          width 40%
          padding-right 4rem
        img
          flex none
          margin 0
      > div
        flex none
        padding-bottom 3.65rem
    .partners-slides
      margin 5rem auto 6rem
      .feature
        display flex
        flex-direction row-reverse
        padding 1rem
        .right
          flex-basis 60%
          img
            box-shadow #FF3956 8px 8px 0
        .left
          flex-basis 40%
          padding-right 4rem
          h3
            font-size: 3rem;
            margin: 0 0 .5rem;
          p
            margin 1rem auto
    .details
      margin 3rem auto 5rem
    .detail-features
    .detail-row
      display flex
      flex-direction row
      justify-content space-between
      margin 0 -1rem 1.5rem
      .detail
        flex-basis 50%
        margin 1rem
        p
          font-size 1.15rem
      .feature
        flex-basis 33%
        margin 1rem
    .theme-default-content
      p
        font-size 1.15rem
    .action-button
      display inline-block
      margin-right 1rem
</style>
