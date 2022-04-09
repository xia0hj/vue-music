<template>
  <BaseScroll class="index-list">
    <ul>
      <li
        v-for="group in data"
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
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
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
    data: {
      type: Array,
      default () {
        return []
      }
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
}
</style>