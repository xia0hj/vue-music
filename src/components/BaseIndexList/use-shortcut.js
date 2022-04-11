import { computed } from 'vue'

export default function useShortcut (props) {
  const shortcutList = computed(() => {
    return props.listData.map((group) => {
      return group.title
    })
  })
  return { shortcutList }
}
