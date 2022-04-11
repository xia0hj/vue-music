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
    // 后面watch了这个scrollY，当发生滚动时会调用watch的回调函数
    // better-scroll往下滚动是负值，而caculate()计算的高度是正值，需要转换
    // pos.y是滚动后页面顶部到当前视图的顶部的距离
    scrollY.value = -pos.y
  }

  const nextGroupDistance = ref(0) // 下一个group的title顶部离容器顶部的距离，用于实现fixedTitle被下一组的title往上顶
  // 发生滚动时调用
  // 当滚动时计算当前y轴坐标落在哪个group中
  watch(scrollY, (newY) => {
    const listHeightsValue = listHeights.value
    for (let i = 0; i < listHeightsValue.length - 1; i++) {
      const groupTop = listHeightsValue[i]
      const groupBottom = listHeightsValue[i + 1]
      if (newY >= groupTop && newY <= groupBottom) {
        currentListIndex.value = i
        // groupBottom是当前组底部的高度，也就是下一组顶部的高度
        // newY是当前视图顶部的高度
        nextGroupDistance.value = groupBottom - newY
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

  const FIXED_TITLE_HEIGHT = 30 // fixedTitle的高度
  const fixedTitleStyle = computed(() => {
    const nextGroupDistanceValue = nextGroupDistance.value
    const diff = (nextGroupDistanceValue > 0 && nextGroupDistanceValue < FIXED_TITLE_HEIGHT) ? nextGroupDistanceValue - FIXED_TITLE_HEIGHT : 0
    return {
      transform: `translate3D(0, ${diff}px, 0)` // 让fixedTitle在y轴上偏移diff
    }
  })

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedTitleStyle
  }
}
