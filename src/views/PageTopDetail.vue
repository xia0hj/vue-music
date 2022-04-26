<template>
  <div class="top-detail">
    <MusicList
      :songs="songs"
      :isLoading="isLoading"
      :title="title"
      :pic="pic"
      isRank
    >
    </MusicList>
  </div>
</template>

<script>
import createDetailComponent from '@/assets/js/create-detail-component'
import { getTopDetail } from '@/service/top-list'
import { TOP_KEY } from '@/assets/js/constant'

export default createDetailComponent(
  'PageTopDetail',
  TOP_KEY,
  getTopDetail
)
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .top-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
