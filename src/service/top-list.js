import { getByAxios } from './base'

export function getTopList () {
  return getByAxios('/api/getTopList')
}

export function getTopDetail (top) {
  return getByAxios('/api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}
