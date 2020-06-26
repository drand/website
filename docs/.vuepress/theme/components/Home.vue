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

    <Content class="theme-default-content custom" />

    <div v-if="data.footer" class="footer">
      {{ data.footer }}
    </div>
  </main>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'

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
    display flex
    flex-wrap wrap
    align-items flex-start
    align-content stretch
    justify-content space-between
  .feature
    flex-grow 1
    flex-basis 48%
    max-width 48%
    margin 3rem auto 6rem
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
</style>
