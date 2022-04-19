import { PLAY_MODE } from '@/assets/js/constant'

export function selectPlay (context, { list, index }) {
  context.commit('setPlayMode', PLAY_MODE.sequence)
  context.commit('setSequenceList', list)
  context.commit('setPlayList', list)
  context.commit('setIsPlaying', true)
  context.commit('setIsFullScreen', true)
  context.commit('setCurrentIndex', index)
}
