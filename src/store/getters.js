export const currentSong = (state) => {
  // 如果playList为空，则返回空对象，避免MusicPlayer组件取currentSong.pic时报错
  return state.playList[state.currentIndex] || {}
}
