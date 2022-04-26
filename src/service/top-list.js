import { getByAxios } from './base'

export function getTopList () {
  return getByAxios('/api/getTopList')
}
