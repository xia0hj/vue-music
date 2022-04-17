<template>
  <div class="music-list">

    <!-- 左上角的返回按钮 -->
    <div
      class="back"
      v-on:click="goBack"
    >
      <i class="icon-back"/>
    </div>

    <!-- 标题文本 -->
    <h1 class="title">{{title}}</h1>

    <!-- 上方的背景图片 -->
    <div
      class="bg-image"
      v-bind:style="bgImageStyle"
      ref="bgImageRef"
    >
      <div class="filter"/>
    </div>

    <!-- 可滚动的歌曲列表 -->
    <BaseScroll
      class="list"
      v-bind:style="scrollListStyle"
      v-loading="isLoading"
    >
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
      default: function () {
        return []
      }
    },
    title: String,
    pic: String,
    isLoading: Boolean
  },
  data: function () {
    return {
      imageHeight: 0
    }
  },
  computed: {
    bgImageStyle: function () {
      return {
        'background-image': `url(${this.$props.pic})`
      }
    },
    scrollListStyle: function () {
      return {
        top: `${this.$data.imageHeight}px`
      }
    }
  },
  mounted: function () {
    console.log('client height = ', this.$refs.bgImageRef.clientHeight)
    this.$data.imageHeight = this.$refs.bgImageRef.clientHeight
  },
  methods: {
    goBack: function () {
      this.$router.back()
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
    height: 0;
    padding-top: 70%;
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
