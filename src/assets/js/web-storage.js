/**
 * value是数组，如果item在数组中不存在则插入到头部，已存在则不作操作
 * @param {string} key key
 * @param {any} item item
 * @param {function} compare 比较value是否相同的函数
 * @returns value数组
 */
export function unshiftItem (key, item, compare) {
  let value = JSON.parse(window.localStorage.getItem(key))
  if (!value) {
    value = []
  }
  compareAndUnshift(value, item, compare)
  return value
}

// 如果根据compare得知value已存在则无操作，不存在则插入到数据头部
function compareAndUnshift (array, item, compare) {
  const findIndex = array.findIndex(compare)
  if (findIndex >= 0) {
    return
  }
  array.unshift(item)
}
