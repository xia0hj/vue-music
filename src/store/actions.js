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

// 从播放列表中去除某一首歌
export function removeSong ({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()

  const sequenceListIndex = findSongIndex(sequenceList, song)
  const playListIndex = findSongIndex(playList, song)

  if (sequenceListIndex < 0 || playListIndex < 0) {
    return
  }

  sequenceList.splice(sequenceListIndex, 1)
  playList.splice(playListIndex, 1)

  let currentIndex = state.currentIndex
  if (playListIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  if (!playList.length) {
    commit('setIsPlaying', false)
  }
}

// 清空播放列表
export function clearSongList ({ commit }) {
  commit('setSequenceList', [])
  commit('setPlayList', [])
  commit('setCurrentIndex', 0)
  commit('setIsPlaying', false)
}

// 添加一首歌曲到播放列表
export function addSong ({ commit, state }, song) {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  const findIndex = findSongIndex(playList, song)
  if (findIndex >= 0) {
    currentIndex = findIndex
  } else {
    playList.push(song)
    currentIndex = playList.length - 1
  }

  const sequenceIndex = findSongIndex(sequenceList, song)
  if (sequenceIndex < 0) {
    sequenceList.push(song)
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  commit('setIsPlaying', true)
  commit('setIsFullScreen', true)

  // setValue(SEQUENCE_LIST_KEY, sequenceList)
  // setValue(PLAY_LIST_KEY, playList)
  // setValue(CUR_PLAY_INDEX, currentIndex)
}

function findSongIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
