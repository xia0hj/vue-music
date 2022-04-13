<template>
  <!-- [Component] Base Slider -->
  <div class="slider" ref="rootRef">
    <div class="slider-group">
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
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
BScroll.use(Slide)
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
  data () {
    return {
      currentPageIndex: 0,
      betterScroll: null // 不放在data里也能用，放在data里能在beforeUnmounted()钩子里获取到
    }
  },
  mounted () {
    const betterScroll = new BScroll(this.$refs.rootRef, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    })
    betterScroll.on('slideWillChange', (page) => {
      this.$data.currentPageIndex = page.pageX
    })
    this.$data.betterScroll = betterScroll
  },
  beforeUnmount () {
    this.$data.betterScroll.destroy()
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
