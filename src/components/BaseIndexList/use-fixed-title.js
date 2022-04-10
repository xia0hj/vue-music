// @ts-check
import { ref, watch, computed, nextTick } from 'vue'

export default function useFixedTitle (props) {
  const groupRef = ref(null)
  const listHeights = ref([])
  const caculate = () => {
    const liList = groupRef.value.children
    const listHeightsValue = listHeights.value
    listHeightsValue.length = 0 // 先清空
    listHeightsValue.push(0)
    let curLiHeight = 0
    for (let i = 0; i < liList.length; i++) {
      curLiHeight += liList[i].clientHeight
      listHeightsValue.push(curLiHeight)
    }
  }
  // 当传入组件的数据变更时，计算每个group的高度
  watch(() => props.data, async () => {
    await nextTick()
    caculate()
  })

  const scrollY = ref(0)
  const currentListIndex = ref(0)
  const onScroll = (pos) => {
    // 参数pos是useScroll.js中contextEmit()发出事件携带的值
    // better-scroll往下滚动是负值，而caculate()计算的高度是正值，需要转换
    scrollY.value = -pos.y
  }
  // 当滚动时计算当前y轴坐标落在哪个group中
  watch(scrollY, (newY) => {
    const listHeightsValue = listHeights.value
    for (let i = 0; i < listHeightsValue.length - 1; i++) {
      const groupTop = listHeightsValue[i]
      const groupBottom = listHeightsValue[i + 1]
      if (newY >= groupTop && newY <= groupBottom) {
        currentListIndex.value = i
      }
    }
  })

  const fixedTitle = computed(() => {
    // 当在顶部还要继续往上拉时，不显示fixedTitle
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentListIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  return {
    groupRef,
    onScroll,
    fixedTitle
  }
}
