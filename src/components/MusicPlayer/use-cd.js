import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd () {
  const store = useStore()
  const isPlaying = computed(() => store.state.isPlaying)

  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const cdClass = computed(() => {
    return isPlaying.value ? 'playing' : ''
  })

  watch(isPlaying, (newState) => {
    // 暂停时将cd的wrapper旋转角度调整为与cd一致
    // 由于cd是在wrapper的基础上再进行旋转的，所以如果wrapper已经旋转，需要叠加
    // transfrom是字符串，中间一个空格将两个transfrom连接起来实现叠加
    if (!newState) {
      const wrapperTransform = getComputedStyle(cdRef.value).transform
      const innerTransfrom = getComputedStyle(cdImageRef.value).transform
      if (wrapperTransform === 'none') {
        cdRef.value.style.transform = innerTransfrom
      } else {
        cdRef.value.style.transform += (' ' + innerTransfrom)
      }
    }
  })

  return {
    cdClass,
    cdRef,
    cdImageRef
  }
}
