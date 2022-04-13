<template>
  <div ref="rootRef">
    <slot/>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
BScroll.use(ObserveDOM)
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
  data () {
    return {
      betterScroll: null
    }
  },
  mounted () {
    // TODO 不知道怎样获取整个props对象
    const scrollOptions = {
      click: this.$props.click,
      probeType: this.$props.probeType,
      observeDOM: true
    }
    const betterScroll = new BScroll(this.$refs.rootRef, scrollOptions)
    if (scrollOptions.probeType > 0) {
      betterScroll.on('scroll', (pos) => {
        this.$emit('triggerScroll', pos)
      })
    }
    this.$data.betterScroll = betterScroll
  },
  beforeUnmount () {
    this.$data.betterScroll.destroy()
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
</style>
