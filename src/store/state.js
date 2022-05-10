import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY, SEQUENCE_LIST_KEY, PLAY_LIST_KEY } from '@/assets/js/constant'
import { getValueArray } from '@/assets/js/web-storage'

const state = {
  sequenceList: getValueArray(SEQUENCE_LIST_KEY), // 要播放的歌曲列表
  playList: getValueArray(PLAY_LIST_KEY), // 播放顺序
  isPlaying: false, // 播放状态
  playMode: PLAY_MODE.sequence, // 播放模式，默认顺序播放
  currentIndex: 0,
  isFullScreen: false,
  favoriteList: getValueArray(FAVORITE_KEY),
  searchHistory: getValueArray(SEARCH_KEY)
}

export default state
