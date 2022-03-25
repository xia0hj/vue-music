import { getByAxios } from './base'

export function getRecommend () {
  return getByAxios('/api/getRecommend')
}
