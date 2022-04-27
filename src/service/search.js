import { getByAxios } from './base'

export function getHotKeys () {
  return getByAxios('/api/getHotKeys')
}
