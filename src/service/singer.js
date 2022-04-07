import { getByAxios } from './base'

export const getSingerList = () => {
  return getByAxios('/api/getSingerList')
}
