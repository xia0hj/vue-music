import { getByAxios } from './base'

export const getSingerList = () => {
  return getByAxios('/api/getSingerList')
}

export const getSingerDetail = (singer) => {
  return getByAxios('/api/getSingerDetail', {
    mid: singer.mid
  })
}
