<template>
  <!-- [Component] My Header -->
  <div class="header">
    <span class="icon" />
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.header {
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;
  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    @include bg-image("~@/assets/image/header-logo/logo");
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }
}
</style>
