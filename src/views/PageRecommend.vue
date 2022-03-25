<template>
  推荐
</template>

<script>
import { getRecommend } from '@/service/recommend.js'

export default {
  name: 'PageRecommend',
  created: async function () {
    const result = await getRecommend()
    console.log(result)
  }
}
</script>
