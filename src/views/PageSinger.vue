<template>
  <div class="singer">
    <BaseIndexList
      v-bind:listData="singers"
      v-on:select="selectSinger"
    />
    <router-view v-bind:singer="selectedSinger"/>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer.js'
import BaseIndexList from '@/components/BaseIndexList'

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
    console.log('page singer get singerList data = ', result)
    this.$data.singers = result.singers
  },
  methods: {
    selectSinger (singer) {
      this.$data.selectedSinger = singer
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
