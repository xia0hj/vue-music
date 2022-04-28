/**
 * value是数组，如果item在数组中不存在则插入到头部，已存在则不作操作
 * @param {string} key key
 * @param {any} item item
 * @param {number} maxLength 数组最大长度，插入后超出长度会移除队尾
 * @param {function} compare 比较item是否相同的函数
 * @returns 操作后的value数组
 */
export function unshiftItem (key, item, maxLength, compare) {
  let value = JSON.parse(window.localStorage.getItem(key))
  if (!value) {
    value = []
  }
  compareAndUnshift(value, item, compare, maxLength)
  window.localStorage.setItem(key, JSON.stringify(value))
  return value
}

/**
 * value是数组，根据compare移除指定item
 * @param {string} key key
 * @param {function} compare 比较item是否相同的函数
 * @returns 操作后的value数组
 */
export function removeItem (key, compare) {
  const value = JSON.parse(window.localStorage.getItem(key))
  if (value) {
    compareAndRemove(value, compare)
  }
  window.localStorage.setItem(key, JSON.stringify(value))
  return value
}

/**
 * 根据key取value数组，如果取不到则返回空数组
 * @param {string} key key
 * @returns {array} value数组
 */
export function getValueArray (key) {
  let value = JSON.parse(window.localStorage.getItem(key))
  if (!value) {
    value = []
  }
  return value
}

// 如果根据compare得知value已存在则无操作，不存在则插入到数据头部
function compareAndUnshift (array, item, compare, maxLength) {
  const findIndex = array.findIndex(compare)
  if (findIndex >= 0) {
    return
  }
  array.unshift(item)
  // 超出最大长度
  if (maxLength && array.length > maxLength) {
    array.pop()
  }
}

function compareAndRemove (array, compare) {
  const findIndex = array.findIndex(compare)
  if (findIndex >= 0) {
    array.splice(findIndex, 1) // 从findIndex开始，删除1个元素
  }
}
