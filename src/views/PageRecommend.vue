<template>
  <div class="recommend">
    <div class="slider-wrapper">
      <div class="slider-content">
        <base-slider :sliders="sliders" v-if="sliders.length"/>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend.js'
import BaseSlider from '../components/base/BaseSlider.vue'

export default {
  name: 'PageRecommend',
  components: {
    'base-slider': BaseSlider
  },
  data: function () {
    return {
      sliders: []
    }
  },
  created: async function () {
    const result = await getRecommend()
    this.sliders = result.sliders
    console.log('PageRecommend get sliders data = ', this.sliders)
  }
}
</script>
