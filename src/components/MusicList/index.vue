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
      <div class="filter" v-bind:style="imagefilterStyle"/>
    </div>

    <!-- 可滚动的歌曲列表 -->
    <BaseScroll
      class="list"
      v-bind:style="scrollListStyle"
      v-loading="isLoading"
      v-no-result:[noResultText]="isNoResult"
      v-bind:probeType="3"
      v-on:emitScroll="onScroll"
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

const TITLE_HEIGHT = 40 // 顶部的标题高度，当列表往上滚时不能遮挡标题

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
    isLoading: Boolean,
    noResultText: {
      type: String,
      default: function () {
        return '抱歉，没有找到可播放的歌曲'
      }
    }
  },
  data: function () {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0 // 歌曲列表往上滚动且没有遮挡标题的最大距离
    }
  },
  computed: {
    bgImageStyle: function () {
      const scrollY = this.$data.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0 // 用于解决ios中z-index失效的问题

      if (scrollY > this.$data.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = `${TITLE_HEIGHT}px`
        translateZ = 1
      }

      // 如果往下拉，需要缩放顶部的背景图片
      let bgImageScale = 1
      if (scrollY < 0) {
        bgImageScale = 1 + Math.abs(scrollY / this.$data.imageHeight)
      }

      return {
        'background-image': `url(${this.$props.pic})`,
        'z-index': zIndex,
        'padding-top': paddingTop,
        height,
        transform: `scale(${bgImageScale}) translateZ(${translateZ}px)`
      }
    },
    scrollListStyle: function () {
      return {
        top: `${this.$data.imageHeight}px`
      }
    },
    imagefilterStyle: function () {
      let blur = 0
      const scrollY = this.$data.scrollY
      const imageHeight = this.$data.imageHeight
      // 歌曲列表往上拉，将背景图片变为模糊
      if (scrollY >= 0) {
        blur = Math.min(
          this.$data.maxTranslateY / imageHeight,
          scrollY / imageHeight
        ) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    },
    isNoResult: function () {
      if (!this.$props.isLoading && !this.$props.songs.length) {
        return true
      } else {
        return false
      }
    }
  },
  mounted: function () {
    this.$data.imageHeight = this.$refs.bgImageRef.clientHeight
    this.$data.maxTranslateY = this.$data.imageHeight - TITLE_HEIGHT
  },
  methods: {
    goBack: function () {
      this.$router.back()
    },
    onScroll: function (pos) {
      this.$data.scrollY = -pos.y
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
