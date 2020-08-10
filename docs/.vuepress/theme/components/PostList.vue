<template>
  <div class="post-list">
    <article v-for="page in posts">
      <header>
        <h2>
          <router-link class="page-link" :to="page.path">{{
            page.title
          }}</router-link>
        </h2>
      </header>
      <p v-if="page.frontmatter.summary">
        {{ page.frontmatter.summary }}
      </p>
      <footer>
        <span class="meta">
          <img src="/images/icon-clock.svg" />
          <time pubdate :datetime="page.frontmatter.date">
            {{ resolvePostDate(page.frontmatter.date) }}
          </time>
        </span>
        <span v-if="page.frontmatter.tags" class="meta tags">
          <img src="/images/icon-tag.svg" />
          <router-link
            v-for="tag in resolvePostTags(page.frontmatter.tags)"
            :key="tag"
            :to="'/tag/' + tag"
            >{{ tag }}</router-link
          >
        </span>
      </footer>
    </article>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'PostList',
  props: ['posts'],
  methods: {
    resolvePostTags(tags) {
      if (!tags || Array.isArray(tags)) return tags
      return [tags]
    },
    resolvePostDate(date) {
      return dayjs(date).format(
        this.$themeConfig.dateFormat || 'ddd MMM DD YYYY'
      )
    }
  }
}
</script>

<style lang="stylus">
.post-list
  margin 3rem 0
  article
    margin 2rem 0
    border-bottom 1px solid var(--border-color)
  h2
    margin-bottom 0
    padding-bottom 0
    border-bottom 0
  footer
    font-size 0.75rem
    margin 1rem 0
    .meta
      margin 0 1rem 0 0
      &.tags a
        margin-right 0.5rem
    img
      width 1.25rem
      vertical-align middle
      margin-right 0.25rem
</style>
