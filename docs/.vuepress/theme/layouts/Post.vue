<template>
  <div class="theme-post-content">
    <ParentLayout>
      <template #page-top>
        <div class="theme-post-header">
          <h1>{{ $page.title }}</h1>
          <span class="meta">
            <img src="/images/icon-clock.svg" />
            <time pubdate :datetime="$page.frontmatter.date">
              {{ resolvePostDate($page.frontmatter.date) }}
            </time>
          </span>
          <span v-if="$page.frontmatter.author" class="meta">
            Author: {{ $page.frontmatter.author }}
          </span>
          <span v-if="$page.frontmatter.tags" class="meta tags">
            <img src="/images/icon-tag.svg" />
            <router-link
              v-for="tag in resolvePostTags($page.frontmatter.tags)"
              :key="tag"
              :to="'/tag/' + tag"
              >{{ tag }}</router-link
            >
          </span>
        </div>
      </template>
    </ParentLayout>
  </div>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import dayjs from 'dayjs'

export default {
  name: 'Post',
  components: {
    ParentLayout
  },
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
.theme-post-header
  max-width 740px
  margin 0 auto
  padding 2rem 2.5rem 0
  h1
    margin-bottom 0.75rem
  .meta
    font-size 0.75rem
    margin 0 1rem 0 0
    &.tags a
      margin-right 0.5rem
  img
    width 1.25rem
    vertical-align middle
    margin-right 0.25rem
.theme-post-content .theme-default-content {
  padding-top 0
}
.theme-post-content .theme-default-content:not(.custom) > :first-child {
  margin-top 2rem
}
</style>
