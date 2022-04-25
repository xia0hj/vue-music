import { getByAxios } from './base'

export function getRecommend () {
  return getByAxios('/api/getRecommend')
}

export function getAlbum (album) {
  return getByAxios('/api/getAlbum', {
    id: album.id
  })
}
