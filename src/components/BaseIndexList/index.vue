<template>
  <BaseScroll
    class="index-list"
    v-bind:probeType="3"
    @triggerScroll="onScroll"
    ref="scrollRef"
  >
    <ul ref="groupRef">
      <li
        v-for="group in listData"
        v-bind:key="group.title"
        class="group"
      >
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li
            v-for="item in group.list"
            v-bind:key="item.id"
            class="item"
          >
            <img class="avatar" v-lazy="item.pic"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 滚动时固定在顶部的标题 -->
    <div class="fixed" v-show="fixedTitle" v-bind:style="fixedTitleStyle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>

    <!-- 侧边的快捷栏 -->
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          v-bind:key="item"
          v-bind:class="{'isCurrent': index===currentIndex}"
          v-bind:data-ItemIndex="index"
        >
        <!-- 使用v-bind:data-变量名将变量保存到DOM的dataset中，注意变量名是连字符会自动转换成小驼峰，如果是驼峰式会自动转换成全小写 -->
          {{item}}
        </li>
      </ul>
    </div>

  </BaseScroll>
</template>

<script>
import BaseScroll from '@/components/BaseScroll'
export default {
  name: 'BaseIndexList',
  components: {
    BaseScroll
  },
  props: {
    listData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      scrollY: 0,
      listHeights: [], // 数组记录每个group的高度
      currentIndex: 0, // 当前group的index
      nextGroupDistance: 0
    }
  },
  methods: {
    onScroll (pos) {
      // pos是BaseScroll组件中triggerScroll事件传来的位置参数
      // scrollY发生变化，调用watch的回调函数
      this.$data.scrollY = -pos.y
    },
    onShortcutTouchStart (event) {

    },
    onShortcutTouchMove (event) {

    }
  },
  watch: {
    listData: async function (newValue, oldValue) {
      await this.$nextTick()
      const liList = this.$refs.groupRef.children
      const listHeights = this.$data.listHeights
      let curLiHeight = 0
      listHeights.length = 0
      listHeights.push(0)
      for (let i = 0; i < liList.length; i++) {
        curLiHeight += liList[i].clientHeight
        listHeights.push(curLiHeight)
      }
    },
    scrollY: function (newValue, oldValue) {
      const listHeights = this.$data.listHeights
      for (let i = 0; i < listHeights.length - 1; i++) {
        const groupTop = listHeights[i]
        const groupBottom = listHeights[i + 1]
        if (newValue >= groupTop && newValue <= groupBottom) {
          this.$data.currentIndex = i
          this.$data.nextGroupDistance = groupBottom - newValue
          break
        }
      }
    }
  },
  computed: {
    fixedTitle: function () {
      if (this.$data.scrollY < 0) {
        return ''
      }
      const currentGroup = this.$props.listData[this.$data.currentIndex]
      return currentGroup ? currentGroup.title : ''
    },
    fixedTitleStyle: function () {
      const FIXED_TITLE_HEIGHT = 30 // fixedTitle的高度
      const nextGroupDistance = this.$data.nextGroupDistance
      const diff = (nextGroupDistance > 0 && nextGroupDistance < FIXED_TITLE_HEIGHT) ? nextGroupDistance - FIXED_TITLE_HEIGHT : 0
      return {
        transform: `translate3D(0, ${diff}px, 0)` // 让fixedTitle在y轴上偏移diff
      }
    },
    shortcutList: function () {
      return this.$props.listData.map((group) => {
        return group.title
      })
    }
  }
  // setup: function (props) {
  //   const { groupRef, onScroll, fixedTitle, fixedTitleStyle, currentIndex } = useFixedTitle(props)
  //   const { shortcutList, onShortcutTouchStart, onShortcutTouchMove, scrollRef } = useShortcut(props, groupRef)
  //   return {
  //     groupRef,
  //     onScroll,
  //     fixedTitle,
  //     fixedTitleStyle,
  //     currentIndex,
  //     shortcutList,
  //     onShortcutTouchStart,
  //     onShortcutTouchMove,
  //     scrollRef
  //   }
  // }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .shortcut {
    position: absolute; // 固定在右边
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.isCurrent {
        color: $color-theme;
      }
    }
  }
}
</style>
