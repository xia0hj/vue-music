<template>
  <div class="tab">
    <router-link
      class="tab-item"
      v-for="tab in tabs"
      v-bind:key="tab.path"
      v-bind:to="tab.path"
    >
      <span class="tab-link">{{tab.name}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NavigationBar',
  data: function () {
    return {
      tabs: [
        { name: '推荐', path: '/recommend' },
        { name: '歌手', path: '/singer' },
        { name: '排行', path: '/top-list' },
        { name: '搜索', path: '/search' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: $font-size-medium;

    .tab-item {
      flex: 1; // 让弹性盒中的子元素有相同的长度
    }
  }
</style>
