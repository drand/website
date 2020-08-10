<template>
  <ParentLayout>
    <template #page-top>
      <div class="theme-default-content">
        <h1>Tagged: {{ $currentTag.key }}</h1>
        <PostList :posts="$currentTag.pages" />
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import PostList from '../components/PostList.vue'
import dayjs from 'dayjs'

export default {
  name: 'Tag',
  components: { ParentLayout, PostList }
}
</script>
