<template>
  <div class="singer">
    <BaseIndexList v-bind:listData="singers"/>
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
      singers: []
    }
  },
  created: async function () {
    const result = await getSingerList()
    console.log('page singer get singerList data = ', result)
    this.$data.singers = result.singers
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
