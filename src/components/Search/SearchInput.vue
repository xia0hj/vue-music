<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      v-model="query"
    />
    <i
      class="icon-dismiss"
      v-show="query"
      @click="clear"
    ></i>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce'
export default {
  name: 'search-input',
  props: {
    modelValue: String // 必须定义为modelValue
  },
  data: function () {
    return {
      query: this.$props.modelValue
    }
  },
  created: function () {
    // 内部data发生变化，向外派发事件传递新的值
    this.$watch('query', debounce(300, (newQuery) => {
      this.$emit('update:modelValue', newQuery.trim()) // 事件名必须为update:modelValue
    }))

    // 外部传入props发生变化，修改内部值
    this.$watch('modelValue', (newValue) => {
      this.$data.query = newValue
    })
  },
  methods: {
    clear: function () {
      this.$data.query = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
