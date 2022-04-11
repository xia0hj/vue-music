import { computed, ref } from 'vue'

export default function useShortcut (props, groupRef) {
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.listData.map((group) => {
      return group.title
    })
  })

  const onShortcutTouchStart = (event) => {
    // 通过v-bind:data-ItemIndex="index"传递的shortcutList的数组index，注意data-前缀必须加上
    // 且变量名默认是短横线隔开式，会自动转换成小驼峰；如果变量名是驼峰式，则自动转换成全小写
    const anchorIndex = parseInt(event.target.dataset.itemindex)
    const targetElement = groupRef.value.children[anchorIndex]
    const scrollInstance = scrollRef.value.scrollInstance
    scrollInstance.scrollToElement(targetElement, 0) // 这是better-scroll的api
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    scrollRef
  }
}
