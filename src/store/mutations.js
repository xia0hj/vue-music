const mutations = {
  setIsPlaying: function (state, isPlaying) {
    state.isPlaying = isPlaying
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
  }
}

export default mutations
