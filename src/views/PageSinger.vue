<template>
  <div class="singer">
    <BaseIndexList
      v-bind:listData="singers"
      v-on:select="selectSinger"
    />
    <!-- router-view v-bind:singer="selectedSinger"/ -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" v-bind:data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer.js'
import BaseIndexList from '@/components/BaseIndexList'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'PageSinger',
  components: {
    BaseIndexList
  },
  data: function () {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  created: async function () {
    const result = await getSingerList()
    this.$data.singers = result.singers
  },
  methods: {
    selectSinger: function (singer) {
      this.$data.selectedSinger = singer
      window.sessionStorage.setItem(SINGER_KEY, JSON.stringify(singer)) // 把singer缓存起来，方便歌手详情页面刷新时使用
      // this.$router.push相当于<router-link to="">
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
