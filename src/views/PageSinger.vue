<template>
  歌手
</template>

<script>
import { getSingerList } from '@/service/singer.js'
export default {
  name: 'PageSinger',
  created: async function () {
    const result = await getSingerList()
    console.log('page singer get singerList data = ', result)
  }
}
</script>
