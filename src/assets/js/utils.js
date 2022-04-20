/**
 * 数组洗牌函数
 * @param {Array} source 原数组
 * @returns 洗牌后的数组
 */
export function shuffle (source) {
  const array = source.slice() // 复制数组，不影响参数原数组
  for (let i = 0; i < array.length; i++) {
    const j = getRandomInt(i)
    swap(array, i, j)
  }
  return array
}

function getRandomInt (max) {
  return Math.floor(Math.random() * (max + 1))
}

function swap (array, idx1, idx2) {
  const temp = array[idx1]
  array[idx1] = array[idx2]
  array[idx2] = temp
}

/**
 * 将总秒数格式化成字符串mm:ss
 * @param {number} time
 * @returns 格式化的时间字符串
 */
export function formatTime (time) {
  time = Math.floor(time)
  // 分钟和秒转成字符串，不足2位在前补0
  const minute = String(Math.floor(time / 60)).padStart(2, '0')
  const second = String(time % 60).padStart(2, '0')
  return `${minute}:${second}`
}
