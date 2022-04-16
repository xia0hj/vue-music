<template>
  <div class="singer-detail">
    <MusicList
      v-bind:songs="songs"
      v-bind:title="title"
      v-bind:pic="pic"
    />
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer.js'
import { processSongs } from '@/service/song'
import MusicList from '@/components/MusicList'
export default {
  name: 'PageSingerDetail',
  components: {
    MusicList
  },
  props: {
    singer: Object
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    pic () {
      return this.$props.singer && this.$props.singer.pic
    },
    title () {
      return this.$props.singer && this.$props.singer.name
    }
  },
  async created () {
    const result = await getSingerDetail(this.$props.singer)
    console.log('page singer detail get data = ', result)
    const songs = await processSongs(result.songs)
    console.log('page singer detail get songs = ', songs)
    this.$data.songs = songs
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
