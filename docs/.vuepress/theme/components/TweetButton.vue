<template>
  <a :href="tweetUrl" target="_blank" rel="noopener noreferrer">Tweet It</a>
</template>

<script>
export default {
  props: ['url', 'text'],
  computed: {
    tweetUrl() {
      const tweetText = encodeURIComponent(this.text)
      const tweetUrl = encodeURIComponent(this.url)
      return `//twitter.com/intent/tweet?text=${tweetText}&url=https://drand.love${tweetUrl}`
    }
  }
}
</script>
