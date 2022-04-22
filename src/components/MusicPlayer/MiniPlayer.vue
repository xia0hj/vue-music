<template>
  <transition name="mini">
    <div class="mini-player" v-show="!isFullScreen" v-on:click="showNormalPlayer">
      <!-- 播放器左侧的封面 -->
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img width="40" height="40" v-bind:src="currentSong.pic" ref="cdImageRef" v-bind:class="cdClass"/>
        </div>
      </div>

      <!-- 歌曲信息 -->
      <div>
        <h2 class="name">{{ currentSong.name }}</h2>
        <p class="desc">{{ currentSong.singer }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

import useCd from './use-cd'

export default {
  name: 'MiniPlayer',
  setup: function () {
    const store = useStore()
    const isFullScreen = computed(() => store.state.isFullScreen)
    const currentSong = computed(() => store.getters.currentSong)

    const {
      cdClass,
      cdRef,
      cdImageRef
    } = useCd()

    function showNormalPlayer () {
      store.commit('setIsFullScreen', true)
    }

    return {
      // 计算属性
      isFullScreen,
      currentSong,
      cdClass,
      // ref
      cdRef,
      cdImageRef,
      // methods
      showNormalPlayer
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
