<template>
  <BaseScroll
    class="index-list"
    v-bind:probeType="3"
    v-on:emitScroll="onScroll"
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
            v-on:click="onItemClick(item)"
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
import useFixedTitle from './use-fixed-title'
import useShortcut from './use-shortcut'
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
  emits: ['select'],
  setup: function (props, context) {
    const { groupRef, onScroll, fixedTitle, fixedTitleStyle, currentIndex } = useFixedTitle(props)
    const { shortcutList, onShortcutTouchStart, onShortcutTouchMove, scrollRef } = useShortcut(props, groupRef)
    const onItemClick = (item) => {
      context.emit('select', item)
    }
    return {
      onItemClick,
      groupRef,
      onScroll,
      fixedTitle,
      fixedTitleStyle,
      currentIndex,
      shortcutList,
      onShortcutTouchStart,
      onShortcutTouchMove,
      scrollRef
    }
  }
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
