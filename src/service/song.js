import { getByAxios } from './base'

export function processSongs (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getByAxios('/api/getSongsUrl', {
    mid: songs.map((song) => { return song.mid })
  }).then((result) => {
    const midMap = result.map
    return songs.map((song) => {
      song.url = midMap[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

const midLyricMap = {} // 缓存歌词,key=song.mid,value=lyric

// GET /api/getLyric 参数:{mid}
export function getLyric (song) {
  const { mid } = song

  // 如果歌词已经缓存到song对象上,则不请求接口直接返回缓存的歌词
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  // 如果歌词已经缓存到midLyricMap上,则不请求接口直接返回缓存的歌词
  const lyricFromMap = midLyricMap[mid]
  if (lyricFromMap) {
    return Promise.resolve(lyricFromMap)
  }

  return getByAxios('/api/getLyric', { mid })
    .then((result) => {
      const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
      midLyricMap[mid] = lyric // 将接口获取的歌词缓存到map
      return lyric
    })
}
