import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/utils'

// 顺序播放
export function sequentialPlay (context, { list, index }) {
  context.commit('setPlayMode', PLAY_MODE.sequence)
  context.commit('setSequenceList', list)
  context.commit('setPlayList', list)
  context.commit('setIsPlaying', true)
  context.commit('setIsFullScreen', true)
  context.commit('setCurrentIndex', index)
}

// 随机播放
export function randomPlay (context, list) {
  context.commit('setPlayMode', PLAY_MODE.random)
  context.commit('setSequenceList', list)
  context.commit('setPlayList', shuffle(list))
  context.commit('setIsPlaying', true)
  context.commit('setIsFullScreen', true)
  context.commit('setCurrentIndex', 0)
}
