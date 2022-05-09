import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll (wrapperRef, scrollProps, contextEmit) {
  const betterScroll = ref(null)

  onMounted(() => {
    betterScroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...scrollProps
    })

    if (scrollProps.probeType > 0) {
      betterScroll.value.on('scroll', (position) => {
        contextEmit('triggerScroll', position)
      })
    }
  })

  onUnmounted(() => {
    betterScroll.value.destroy()
  })

  onActivated(() => {
    betterScroll.value.enable()
    betterScroll.value.refresh()
  })

  onDeactivated(() => {
    betterScroll.value.disable()
  })

  return betterScroll
}
