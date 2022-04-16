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
