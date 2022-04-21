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
      return song.url.indexOf('vkey') > -1
    })
  })
}

// GET /api/getLyric 参数:{mid}
export function getLyric (song) {
  const { mid } = song

  return getByAxios('/api/getLyric', { mid })
    .then((result) => {
      const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
      return lyric
    })
}
