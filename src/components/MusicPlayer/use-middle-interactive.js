import { ref } from 'vue'

import { limitBetween } from '@/assets/js/utils'

export default function useMiddleInteractive () {
  let curShowPage = 'cd' // 拖动结束中间层实际展示的页面
  const touchMoveResult = ref('cd') // 发生拖动期间，即将会显示的结果页面
  const middleLeftStyle = ref(null)
  const middleRightStyle = ref(null)

  const touchRecord = {
    startX: 0,
    deltaX: 0,
    lyricOffsetPercent: 0
  }

  function onMiddleTouchStart (e) {
    touchRecord.startX = e.touches[0].pageX
  }

  function onMiddleTouchMove (e) {
    touchRecord.deltaX = e.touches[0].pageX - touchRecord.startX
    // 默认状态cd在中间lyric在cd的右侧，设此时lyric的x偏移是0；当lyric拖动中间后，lyric就往左移动了-innerWidth
    const lyricTranslateX = (curShowPage === 'cd' ? 0 : -window.innerWidth)
    // 拖动期间lyric相对于默认位置的位移，在-innerWidth到0之间
    const lyricOffsetX = limitBetween(lyricTranslateX + touchRecord.deltaX, -window.innerWidth, 0)
    // 拖动期间lyric相对于默认位置的位移占窗口宽度的比例
    touchRecord.lyricOffsetPercent = Math.abs(lyricOffsetX / window.innerWidth)

    // 计算本次拖动将会切换到哪个页面
    if (curShowPage === 'cd') {
      // 当前=cd，如果往左拖动期间lyric向左的偏移大于20%，表示将会切换到lyric
      if (touchRecord.lyricOffsetPercent > 0.2) {
        touchMoveResult.value = 'lyric'
      } else {
        touchMoveResult.value = 'cd'
      }
    } else if (curShowPage === 'lyric') {
      // 当前=lyric，如果往右拖动期间lyric向左的偏移小于80%，表示将会切换到cd
      if (touchRecord.lyricOffsetPercent < 0.8) {
        touchMoveResult.value = 'cd'
      } else {
        touchMoveResult.value = 'lyric'
      }
    }

    // 调整拖动期间cd页面的透明度,lyric向左的偏移越大，cd越透明
    middleLeftStyle.value = {
      opacity: 1 - touchRecord.lyricOffsetPercent,
      transitionDuration: '0ms'
    }

    // 调整拖动期间lyric的实际偏移
    middleRightStyle.value = {
      transform: `translate3d(${lyricOffsetX}px, 0, 0)`,
      transitionDuration: '0ms'
    }
  }

  function onMiddleTouchEnd (e) {
    // 拖动结束，调整最终cd的透明度和lyric的偏移量
    let opacity
    let offset
    if (touchMoveResult.value === 'cd') {
      curShowPage = 'cd'
      opacity = 1
      offset = 0
    } else if (touchMoveResult.value === 'lyric') {
      curShowPage = 'lyric'
      opacity = 0
      offset = -window.innerWidth
    }

    const duration = 300
    middleLeftStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRightStyle.value = {
      transform: `translate3d(${offset}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    touchMoveResult,
    middleLeftStyle,
    middleRightStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
