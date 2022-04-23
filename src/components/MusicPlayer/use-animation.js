import { ref } from 'vue'
import createKeyframeAnimation from 'create-keyframe-animation'

export default function useAnimation () {
  const cdWrapperRef = ref(null)
  let isEntering = false
  let isLeaving = false

  function getOffsetAndScale () {
    const SMALL_WIDTH = 40 // 左下角小圆的直径
    const SMALL_LEFT_DISTANCE = 40 // 小圆圆心到左边界距离
    const SMALL_BOTTOM_DISTANCE = 30 // 小圆圆心到底部距离
    const BIG_TOP_DISTANCE = 80 // 大圆圆心到顶部距离
    const BIG_WIDTH = window.innerWidth * 0.8 // 大圆的直径

    const offsetX = -(window.innerWidth / 2 - SMALL_LEFT_DISTANCE) // 大圆移动到小圆的x轴偏移量
    const offsetY = window.innerHeight - SMALL_BOTTOM_DISTANCE - BIG_TOP_DISTANCE // 大圆移动到小圆的y轴偏移量
    const cdScale = SMALL_WIDTH / BIG_WIDTH // 圆的大小比例

    return {
      offsetX,
      offsetY,
      cdScale
    }
  }

  // 小圆变大圆
  function enter (el, done) {
    if (isLeaving) {
      afterLeave()
    }
    isEntering = true

    const { offsetX, offsetY, cdScale } = getOffsetAndScale()

    // 从小圆变成大圆的动画
    const animation = {
      0: {
        transform: `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${cdScale})`
      },
      100: {
        transform: 'translate3d(0,0,0) scale(1)'
      }
    }

    createKeyframeAnimation.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600, // 600毫秒
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    createKeyframeAnimation.runAnimation(cdWrapperRef.value, 'move', done)
  }
  function afterEnter () {
    isEntering = false
    createKeyframeAnimation.unregisterAnimation('move')
    cdWrapperRef.value.animation = ''
  }

  // 大圆变小圆
  function leave (el, done) {
    // 正在enter就退出，需要先手动执行afterEnter
    if (isEntering) {
      afterEnter()
    }
    isLeaving = true

    const { offsetX, offsetY, cdScale } = getOffsetAndScale()
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${cdScale})`
    cdWrapperEl.style.transition = 'all 0.6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.addEventListener('transitionend', next)

    function next () {
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
  }
  function afterLeave () {
    isLeaving = false
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transform = ''
    cdWrapperEl.style.transition = ''
  }

  return {
    enter,
    afterEnter,
    leave,
    afterLeave,
    cdWrapperRef
  }
}
