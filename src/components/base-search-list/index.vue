<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li class="search-item"
        v-for="item in searches"
        :key="item"
        @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="removeItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'base-search-list',
  props: {
    searches: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  emits: ['selectItem', 'removeItem'],
  methods: {
    selectItem: function (item) {
      this.$emit('selectItem', item)
    },
    removeItem: function (item) {
      this.$emit('removeItem', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .search-list {
    .search-item {
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      .text {
        flex: 1;
        color: $color-text-l;
      }
      .icon {
        @include extend-click();
        .icon-delete {
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
</style>
