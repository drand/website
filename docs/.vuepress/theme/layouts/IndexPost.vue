<template>
  <ParentLayout>
    <template #page-top>
      <div class="theme-default-content">
        <h1>Blog</h1>
        <p>
          Here you can find project updates, upcoming events, and breaking news
          about the drand project.
        </p>
        <PostList :posts="$pagination.pages" />
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
import PostList from '../components/PostList.vue'
import dayjs from 'dayjs'

export default {
  name: 'IndexPost',
  components: { ParentLayout, PostList }
}
</script>

<style lang="stylus">
#pagination
  text-align center
</style>
