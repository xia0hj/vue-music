<template>
  <div ref="rootRef">
    <slot/>
  </div>
</template>

<script>
import useScroll from './useScroll.js'
import { ref } from 'vue'

export default {
  name: 'BaseScroll',
  props: {
    click: {
      type: Boolean,
      default: true
    }
  },
  setup: function (props) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props)
    return {
      rootRef,
      scroll
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
</style>
