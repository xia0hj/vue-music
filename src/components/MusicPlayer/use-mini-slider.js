import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'

import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
BScroll.use(Slide)

export default function useMiniSlider () {
  const store = useStore()
  const isFullScreen = computed(() => store.state.isFullScreen)
  const playList = computed(() => store.state.playList)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderWrapperRef = ref(null)
  const betterScroll = ref(null)

  const shouldSliderShow = computed(() => {
    if (!isFullScreen.value && playList.value) {
      return true
    } else {
      return false
    }
  })

  onMounted(() => {
    let bsCache
    watch(shouldSliderShow, async (newValue) => {
      if (newValue) {
        await nextTick()
        if (!bsCache) {
          // 创建Better Scroll的实例
          betterScroll.value = bsCache = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          // 滑动后切换歌曲
          bsCache.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
            store.commit('setIsPlaying', true)
          })
        } else {
          bsCache.refresh()
        }
        // 刚加载底部播放器时，马上切换到当前播放的歌曲
        bsCache.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, (newIndex) => {
      if (bsCache && shouldSliderShow.value) {
        bsCache.goToPage(newIndex, 0, 0)
      }
    })
  })

  onUnmounted(() => {
    if (betterScroll.value) {
      betterScroll.value.destroy()
    }
  })

  return {
    betterScroll,
    sliderWrapperRef
  }
}
