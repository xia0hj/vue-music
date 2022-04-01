import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider (wrapperRef) {
  const sliderRef = ref(null)

  onMounted(() => {
    sliderRef.value = new BScroll(wrapperRef.value, {
      click: true, // 可点击
      scrollX: true, // x轴可滚动
      scrollY: false, // y轴不可滚动
      momentum: false, // 滚动动画
      bounce: false, // 滚动超过边缘时的回弹动画
      probeType: 2, // probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件
      slide: true // 使用slide对象的默认配置
    })
  })

  onUnmounted(() => {
    sliderRef.value.destroy()
  })

  return {
    sliderRef
  }
}
