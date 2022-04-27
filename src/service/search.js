import { getByAxios } from './base'

export function getHotKeys () {
  return getByAxios('/api/getHotKeys')
}

/**
 * 通过/api/search接口进行搜索
 * @param {string} query 搜索关键字
 * @param {number} page 分页页码
 * @param {boolean} isShowSinger 返回搜索结果是否需要包含歌手
 * @returns ..
 */
export function search (query, page, isShowSinger) {
  return getByAxios('/api/search', {
    query,
    page,
    isShowSinger
  })
}
