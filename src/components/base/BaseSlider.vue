<template>
  <div class="slider">
    <div class="slider-group" ref="rootRef">
      <!-- 轮播图的集合 -->
      <div
        class="slider-page"
        v-for="item in sliders"
        v-bind:key="item.id"
      >
        <a v-bind:href='item.link'>
          <img v-bind:src="item.pic"/>
        </a>
      </div>
    </div>
    <!-- 轮播图的小圆点 -->
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        v-bind:key="item.id"
        v-bind:class="{'active': currentPageIndex === index}"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import useSlider from '@/composables/useSlider.js'

export default {
  name: 'BaseSlider',
  props: {
    // 此处表示sliders是一个数组，默认返回空数组
    // sliders数组每个元素是{id,pic,link}
    sliders: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  setup: function () {
    const rootRef = ref(null)
    const { currentPageIndex } = useSlider(rootRef)
    return {
      rootRef,
      currentPageIndex
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.slider {
  min-height: 1px;
  font-size: 0;
  touch-action: pan-y;

  .slider-group {
    position: relative;
    white-space: nowrap; // 让轮播图图片不换行
    overflow: hidden; // 让不换行而且超出框的图片隐藏

    .slider-page {
      display: inline-block;

      a {
        display: block;
        width: 100%;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
}

.dots-wrapper {
  position: absolute;
  left: 50%;
  bottom: 12px;
  line-height: 12px;
  transform: translateX(-50%);

  .dot {
    display: inline-block;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    transform: translateZ(1px);
    border-radius: 50%;
    background: $color-text-l;

    &.active {
      width: 20px;
      border-radius: 5px;
      background: $color-text-ll;
    }
  }
}
</style>
