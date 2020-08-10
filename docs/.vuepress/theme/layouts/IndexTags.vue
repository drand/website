<template>
  <ParentLayout>
    <template #page-top>
      <div class="theme-default-content">
        <h1>Tags</h1>
        <ul id="default-layout">
          <li v-for="tag in $tag.list">
            <router-link class="page-link" :to="tag.path">{{
              tag.name
            }}</router-link>
          </li>
        </ul>
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import dayjs from 'dayjs'

export default {
  name: 'Tags',
  components: {
    ParentLayout
  }
}
</script>
