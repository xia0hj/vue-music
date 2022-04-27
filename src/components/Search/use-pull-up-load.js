import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

/**
 * @param {function} requestData 异步请求数据的函数
 */
export default function usePullUpLoad (requestData) {
  const betterScroll = ref(null)
  const scrollWrapperRef = ref(null)
  const isPullUpLoading = ref(false)

  onMounted(() => {
    betterScroll.value = new BScroll(scrollWrapperRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    })
    const bsVal = betterScroll.value
    bsVal.on('pullingUp', pullingUpHandler)

    async function pullingUpHandler () {
      isPullUpLoading.value = true
      await requestData()
      bsVal.finishPullUp()
      bsVal.refresh()
      isPullUpLoading.value = false
    }
  })

  onUnmounted(() => {
    betterScroll.value.destroy()
  })

  return {
    scrollWrapperRef,
    isPullUpLoading
  }
}
