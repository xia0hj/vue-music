import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  sequenceList: [], // 要播放的歌曲列表
  playList: [], // 播放顺序
  isPlaying: false, // 播放状态
  playMode: PLAY_MODE.sequence, // 播放模式，默认顺序播放
  currentIndex: 0,
  isFullScreen: false,
  favoriteList: []
}

export default state
