import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import BaseScroll from '@/components/BaseScroll'

export default {
  name: 'WrappedScroll',
  props: BaseScroll.props,
  emits: BaseScroll.emits,
  render: function (ctx) {
    return h(
      BaseScroll,
      mergeProps(
        { ref: 'scrollRef' },
        ctx.$props,
        {
          // 将BaseScroll中的triggerScroll事件继续往外派发
          // 接收到BaseScroll的triggerScroll，会调用onTriggerScroll，注意名字错的话没法接收
          onTriggerScroll: (e) => {
            ctx.$emit('triggerScroll', e)
          }
        }
      ),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup: function () {
    const scrollRef = ref(null)
    const betterScroll = computed(() => {
      return scrollRef.value.betterScroll
    })

    const store = useStore()
    const playList = computed(() => store.state.playList)

    watch(playList, async () => {
      await nextTick()
      betterScroll.value.refresh()
    })

    return {
      scrollRef,
      betterScroll
    }
  }
}
