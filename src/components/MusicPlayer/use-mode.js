import { useStore } from 'vuex'
import { computed } from 'vue'

import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode () {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)
  const modeIcon = computed(() => {
    const playModeValue = playMode.value
    if (playModeValue === PLAY_MODE.sequence) {
      return 'icon-sequence'
    } else if (playModeValue === PLAY_MODE.random) {
      return 'icon-random'
    } else if (playModeValue === PLAY_MODE.loop) {
      return 'icon-loop'
    } else {
      return 'playMode in state is wrong'
    }
  })
  const modeText = computed(() => {
    const playModeValue = playMode.value
    if (playModeValue === PLAY_MODE.sequence) {
      return '顺序播放'
    } else if (playModeValue === PLAY_MODE.random) {
      return '随机播放'
    } else if (playModeValue === PLAY_MODE.loop) {
      return '循环播放'
    } else {
      return 'playMode in state is wrong'
    }
  })

  // 切换播放模式
  function changeMode () {
    // 切换播放模式后还要调整播放列表，不要同时执行多个commit去调用mutation，要将多个mutation封装成action
    const mode = (playMode.value + 1) % 3
    store.dispatch('changePlayMode', mode)
  }

  return {
    modeIcon,
    modeText,
    changeMode
  }
}
