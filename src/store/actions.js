import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/utils'

// 顺序播放
export function sequentialPlay ({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayList', list)
  commit('setIsPlaying', true)
  commit('setIsFullScreen', true)
  commit('setCurrentIndex', index)
}

// 随机播放
export function randomPlay ({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayList', shuffle(list))
  commit('setIsPlaying', true)
  commit('setIsFullScreen', true)
  commit('setCurrentIndex', 0)
}

// 切换播放模式
export function changePlayMode ({ commit, state, getters }, newMode) {
  const curSongId = getters.currentSong.id
  if (newMode === PLAY_MODE.random) {
    // 随机播放，要将顺序列表洗牌后放入播放列表
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    // 顺序播放或单曲循环，播放列表=顺序列表
    commit('setPlayList', state.sequenceList)
  }

  // 为了调整播放列表后，不打断当前正在播放的歌曲，需要找到当前歌曲在新的播放列表中的index
  const newIndex = state.playList.findIndex((song) => {
    return song.id === curSongId
  })
  commit('setCurrentIndex', newIndex)

  commit('setPlayMode', newMode)
}
