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
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['callScroll'], // 声明该组件会往外派发scroll事件
  setup: function (props, context) {
    const rootRef = ref(null)
    const scrollInstance = useScroll(rootRef, props, context.emit)
    return {
      rootRef,
      scrollInstance // better-scroll的实例对象，放出来让其他组件能够通过scrollRef.value.scrollInstance获取
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
</style>
