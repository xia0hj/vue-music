import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY, SYNC_LIST_KEY } from '@/assets/js/constant'
import { getValueArray, getValue } from '@/assets/js/web-storage'

const { sequenceList, curSongIdxInSeqList } = getValue(SYNC_LIST_KEY)

const state = {
  sequenceList: sequenceList, // 要播放的歌曲列表
  playList: [], // 播放顺序
  isPlaying: false, // 播放状态
  playMode: PLAY_MODE.sequence, // 播放模式，默认顺序播放
  currentIndex: curSongIdxInSeqList,
  isFullScreen: false,
  favoriteList: getValueArray(FAVORITE_KEY),
  searchHistory: getValueArray(SEARCH_KEY)
}

export default state
