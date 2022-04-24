<template>
  <transition name="mini">
    <div class="mini-player" v-show="!isFullScreen" v-on:click="showNormalPlayer">
      <!-- #region 播放器左侧的封面 -->
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img width="40" height="40" v-bind:src="currentSong.pic" ref="cdImageRef" v-bind:class="cdClass"/>
        </div>
      </div>
      <!-- #endregion -->

      <!-- #region 歌曲信息,类似轮播图可滑动切换 -->
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-group">
          <div
            class="slider-page"
            v-for="song in playList"
            v-bind:key="song.id"
          >
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <!-- #endregion -->

      <!-- #region 控制按钮 -->
      <div class="control">
        <ProgressCircle
          v-bind:radius="32"
          v-bind:progress="progress"
        >
          <i
            class="icon-mini"
            v-bind:class="miniPlayIcon"
            @click.stop="togglePlay"
          >
          </i>
        </ProgressCircle>
      </div>
      <!-- #endregion -->

      <!-- #region 可隐藏的播放列表 -->
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <PlayList ref="playListRef"/>
      <!-- #endregion -->
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

import useCd from './use-cd'
import useMiniSlider from './use-mini-slider'

import ProgressCircle from './ProgressCircle'
import PlayList from './PlayList'

export default {
  name: 'MiniPlayer',
  components: {
    ProgressCircle,
    PlayList
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup: function () {
    const store = useStore()
    const isFullScreen = computed(() => store.state.isFullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const isPlaying = computed(() => store.state.isPlaying)
    const playList = computed(() => store.state.playList)
    const miniPlayIcon = computed(() => {
      return isPlaying.value ? 'icon-pause-mini' : 'icon-play-mini'
    })
    const playListRef = ref(null)

    const {
      cdClass,
      cdRef,
      cdImageRef
    } = useCd()

    const {
      sliderWrapperRef,
      betterScroll
    } = useMiniSlider()

    function showNormalPlayer () {
      store.commit('setIsFullScreen', true)
    }

    function showPlayList () {
      playListRef.value.showList()
    }

    return {
      // 计算属性
      isFullScreen,
      currentSong,
      cdClass,
      isPlaying,
      miniPlayIcon, // 播放按钮图标的样式class
      playList,
      // ref
      cdRef,
      cdImageRef,
      sliderWrapperRef,
      betterScroll, // betterScroll的实例，暂时用不上
      playListRef,
      // methods
      showNormalPlayer, // 切换全屏的函数
      showPlayList
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    .cd-wrapper {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      .cd {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
          &.playing {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }
    .slider-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-page {
          display: inline-block;
          width: 100%;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          .name {
            margin-bottom: 2px;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text;
          }
          .desc {
            @include no-wrap();
            font-size: $font-size-small;
            color: $color-text-d;
          }
        }
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-playlist {
        position: relative;
        top: -2px;
        font-size: 28px;
        color: $color-theme-d;
      }
      .icon-mini {
        position: absolute;
        left: 0;
        top: 0;
        color: $color-theme-d;
        font-size: 32px;
      }
    }
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
    }
    &.mini-enter-from, &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 100%, 0)
    }
  }
</style>
