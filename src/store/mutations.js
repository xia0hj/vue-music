import { setValue } from '@/assets/js/web-storage'
import { STOP_KEY } from '@/assets/js/constant'
import { getUid } from '@/assets/js/utils'

const mutations = {
  setIsPlaying: function (state, isPlaying) {
    state.isPlaying = isPlaying
    if (isPlaying === true) {
      // 当前标签页开始播放，修改 localStorage 通知其他标签页停止播放
      // 如果值相同不会触发事件，所以每次修改 localStorage 都要设 uid
      setValue(STOP_KEY, getUid())
    }
  },
  setSequenceList: function (state, list) {
    state.sequenceList = list
  },
  setPlayList: function (state, list) {
    state.playList = list
  },
  setPlayMode: function (state, mode) {
    state.playMode = mode
  },
  setCurrentIndex: function (state, index) {
    state.currentIndex = index
  },
  setIsFullScreen: function (state, isFullScreen) {
    state.isFullScreen = isFullScreen
  },
  setFavoriteList: function (state, list) {
    state.favoriteList = list
  },
  setSearchHistory: function (state, searches) {
    state.searchHistory = searches
  },
  // 将歌词缓存到song对象上
  addSongLyric: function (state, { song, lyric }) {
    state.sequenceList.map((item) => {
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
      return item
    })
  }
}

export default mutations
