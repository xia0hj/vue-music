<template>
  <div class="music-list">

    <!-- 左上角的返回按钮 -->
    <div class="back"><i class="icon-back"/></div>

    <!-- 标题文本 -->
    <h1 class="title">{{title}}</h1>

    <!-- 上方的背景图片 -->
    <div
      class="bg-image"
      v-bind:style="bgImageStyle"
    >
      <div class="filter"/>
    </div>

    <!-- 可滚动的歌曲列表 -->
    <BaseScroll class="list">
      <div class="song-list-wrapper">
        <BaseSongList v-bind:songs="songs"/>
      </div>
    </BaseScroll>

  </div>
</template>

<script>
import BaseScroll from '@/components/BaseScroll'
import BaseSongList from '@/components/BaseSongList'
export default {
  name: 'MusicList',
  components: {
    BaseScroll,
    BaseSongList
  },
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    title: String,
    pic: String
  },
  computed: {
    bgImageStyle: function () {
      return {
        'background-image': `url(${this.$props.pic})`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
