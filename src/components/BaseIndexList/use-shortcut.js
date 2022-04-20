import { computed, ref } from 'vue'

export default function useShortcut (props, groupRef) {
  const ANCHOR_HEIGHT = 18 // 右侧快捷栏中每个锚点的高度
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.listData.map((group) => {
      return group.title
    })
  })

  const touchMoveRecord = {
    startY: undefined,
    endY: undefined,
    oldAnchorIndex: undefined
  }

  function onShortcutTouchStart (event) {
    // 通过v-bind:data-ItemIndex="index"传递的shortcutList的数组index，注意data-前缀必须加上
    // 且变量名默认是短横线隔开式，会自动转换成小驼峰；如果变量名是驼峰式，则自动转换成全小写
    const anchorIndex = parseInt(event.target.dataset.itemindex)
    touchMoveRecord.startY = event.touches[0].pageY // 开始触摸时记录起始y轴坐标
    touchMoveRecord.oldAnchorIndex = anchorIndex // 开始触摸时记录起始锚点index
    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove (event) {
    touchMoveRecord.endY = event.touches[0].pageY // 手指移动时实时记录y轴坐标
    // 计算y轴坐标变化量，除以每个锚点的高度，得出锚点index的变化量
    const anchorIndexChange = Math.floor((touchMoveRecord.endY - touchMoveRecord.startY) / ANCHOR_HEIGHT)
    const newAnchorIndex = touchMoveRecord.oldAnchorIndex + anchorIndexChange
    scrollTo(newAnchorIndex)
  }

  function scrollTo (anchorIndex) {
    // 有可能手指点到的不是锚点元素，导致event.target.dataset.itemindex是undefine，所以要判断如果是NaN则不进行滚动什么都不做
    if (isNaN(anchorIndex)) {
      return
    }
    // 当触摸移动到侧边快捷栏以外的地方时，onShortcutTouchMove()算得的anchorIndexChange会很大导致index超出shortcutList，需要限制anchorIndex参数值的范围避免下标越界
    anchorIndex = Math.min(anchorIndex, shortcutList.value.length - 1)
    anchorIndex = Math.max(anchorIndex, 0)
    const targetElement = groupRef.value.children[anchorIndex]
    const betterScroll = scrollRef.value.betterScroll
    betterScroll.scrollToElement(targetElement, 0) // 这是better-scroll的api
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    scrollRef
  }
}
