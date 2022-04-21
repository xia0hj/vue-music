import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'

import { getLyric } from '@/service/song'

import Lyric from 'lyric-parser'

/**
 * @param {Ref<boolean>} isSongReady audio是否准备好播放的标记ref
 * @param {Ref<number>} currentTime 当前播放时间ref
 */
export default function useLyric (isSongReady, currentTime) {
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  const lyricParser = ref(null)
  const currentLineNum = ref(0)

  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }

    // 切换歌曲时可能会在新歌词拿到前就开始播放了，导致去滚动旧的歌词，所以一旦切换要先重置
    stopLyric()
    lyricParser.value = null
    currentLineNum.value = 0

    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {
      song: newSong,
      lyric: lyric
    }) // 将歌词缓存到song对象上

    // 获取到歌词后发现currentSong已经改变了，则不需要再解析歌词
    if (currentSong.value.lyric !== lyric) {
      return
    }

    lyricParser.value = new Lyric(lyric, handleLyric)
    console.log('LyricParser: ', lyricParser.value)

    // 歌曲正在播放，需要自动调整歌词
    if (isSongReady.value) {
      playLyric()
    }
  })

  function handleLyric ({ lineNum }) {
    currentLineNum.value = lineNum
    const scrollComponent = lyricScrollRef.value
    const lyricEl = lyricListRef.value
    if (!lyricEl) {
      return
    }
    if (lineNum > 5) {
      // 要让第5行歌词居中，就是要让第lineNum-5行的歌词滚动到scroll容器顶部
      const lineEl = lyricEl.children[lineNum - 5]
      scrollComponent.betterScroll.scrollToElement(lineEl, 1000)
    } else {
      // 正在播放前5行歌词，那就不居中直接滚动到顶部
      scrollComponent.betterScroll.scrollTo(0, 0, 1000)
    }
  }

  // 让歌词开始滚动
  function playLyric () {
    const lyricParserValue = lyricParser.value
    if (lyricParserValue) {
      lyricParserValue.seek(currentTime.value * 1000)
    }
  }

  // 让歌词停止滚动
  function stopLyric () {
    const lyricParserValue = lyricParser.value
    if (lyricParserValue) {
      lyricParserValue.stop()
    }
  }

  return {
    lyricParser,
    currentLineNum,
    playLyric,
    stopLyric,
    lyricScrollRef,
    lyricListRef
  }
}
