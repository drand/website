<template>
  <ParentLayout>
    <template #page-top>
      <div class="theme-default-content">
        <h1>Blog</h1>
        <p>
          Here you can find project updates, upcoming events, and breaking news
          about the drand project.
        </p>
        <div id="blog-index">
          <article v-for="page in $pagination.pages">
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
        <div id="pagination">
          <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink"
            >Prev</router-link
          >
          <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink"
            >Next</router-link
          >
        </div>
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import dayjs from 'dayjs'

export default {
  name: 'IndexPost',
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
#blog-index
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
#pagination
  text-align center
</style>
