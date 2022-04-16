<template>
  <div class="singer-detail">

  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer.js'
import { processSongs } from '@/service/song'
export default {
  name: 'PageSingerDetail',
  props: {
    singer: Object
  },
  async created () {
    const result = await getSingerDetail(this.$props.singer)
    console.log('page singer detail get data = ', result)
    const songs = await processSongs(result.songs)
    console.log('page singer detail get songs = ', songs)
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
