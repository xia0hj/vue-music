<template>
  <!-- [View] Page Recommend -->
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
import BaseSlider from '@/components/BaseSlider.vue'

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
  async created () {
    const result = await getRecommend()
    this.sliders = result.sliders
    console.log('PageRecommend get sliders data = ', this.sliders)
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;

  .slider-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 40%;
    overflow: hidden;

    .slider-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}

</style>
