<template>
  <vue-plyr ref="plyr">
    <video crossorigin :data-poster="'http://localhost:1337' + posterUrl">
      <source :src="'http://localhost:1337' + videoUrl" type="video/mp4" />
      <track
        kind="captions"
        label="English"
        :src="'http://localhost:1337' + subtitlesUrl"
        srclang="en"
        default
      />
    </video>
  </vue-plyr>
</template>

<script>
export default {
  props: ['videoUrl', 'subtitlesUrl', 'posterUrl'],
  computed: {
    player() {
      return this.$refs.plyr.player
    },
  },
  mounted() {
    this.player.on('play', () => console.log('event fired'))
  },
  destroyed() {
    this.player.destroy()
  },
}
</script>

<style>
.plyr__video-wrapper {
  height: 480px;
}
</style>
