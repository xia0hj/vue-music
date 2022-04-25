<template>
  <div class="album">
    <MusicList
      :songs="songs"
      :isLoading="isLoading"
      :pic="pic"
      :title="title"
    ></MusicList>
  </div>
</template>

<script>
import createDetailComponent from '@/assets/js/create-detail-component'
import { ALBUM_KEY } from '@/assets/js/constant'
import { getAlbum } from '@/service/recommend'
export default createDetailComponent('PageAlbum', ALBUM_KEY, getAlbum)
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .album {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
