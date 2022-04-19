<template>
  <div class="singer-detail">
    <MusicList
      v-bind:songs="songs"
      v-bind:title="title"
      v-bind:pic="pic"
      v-bind:isLoading="isLoading"
    />
  </div>
</template>

<script>

import { getSingerDetail } from '@/service/singer.js'
import { processSongs } from '@/service/song'
import MusicList from '@/components/MusicList'
import { SINGER_KEY } from '@/assets/js/constant'

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
      songs: [],
      isLoading: true
    }
  },
  computed: {
    pic () {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title () {
      const singer = this.computedSinger
      return singer && singer.name
    },
    computedSinger: function () {
      // 如果是从歌手列表点进来详情页面，父组件会传一个singer参数
      // 如果刷新详情页面，singer参数从缓存中获取
      let returnSinger = null
      const propsSinger = this.$props.singer
      if (propsSinger) {
        returnSinger = propsSinger
      } else {
        const cachedSinger = JSON.parse(window.sessionStorage.getItem(SINGER_KEY))
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          returnSinger = cachedSinger
        }
      }
      return returnSinger
    }
  },
  async created () {
    if (!this.computedSinger) {
      // 歌手详情页的路径是/singer/${mid}，当获取不到singer时需要回退到/singer
      const prePath = this.$route.matched[0].path
      this.$router.push({ path: prePath })
      return
    }
    const result = await getSingerDetail(this.computedSinger)
    console.log('page singer detail get data = ', result)
    const songs = await processSongs(result.songs)
    console.log('page singer detail get songs = ', songs)
    // this.$data.songs = [] // 测试取不到songs的情况
    this.$data.songs = songs
    this.$data.isLoading = false
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
