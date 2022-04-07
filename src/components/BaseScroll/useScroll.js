import BScroll from '@better-scroll/core'
import { onMounted, onUnmounted, ref } from 'vue'

export default function useScroll (wrapperRef, options) {
  const scroll = ref(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value)
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })
}
