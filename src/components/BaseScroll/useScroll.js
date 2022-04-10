import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll (wrapperRef, scrollProps, contextEmit) {
  const scroll = ref(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...scrollProps
    })

    if (scrollProps.probeType > 0) {
      scroll.value.on('scroll', (position) => {
        contextEmit('callScroll', position)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })
}
