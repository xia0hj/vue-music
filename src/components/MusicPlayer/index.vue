<template>
  <div class="player">
    <div
      class="normal-player"
      v-show="isFullScreen"
    >
      <!-- 背景图片 -->
      <div class="background">
        <img v-bind:src="currentSong.pic"/>
      </div>

      <!-- 顶部 -->
      <div class="top">
        <div class="back" v-on:click="goBack"><i class="icon-back"/></div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>

      <!-- 底部播放控制按钮 -->
      <div class="bottom">
        <div class="operators">
          <!-- 左侧按钮 -->
          <div class="icon i-left">
            <i v-bind:class="modeIcon" v-on:click="changeMode"/>
          </div>
          <div class="icon i-left" v-bind:class="disableBtnClass">
            <i class="icon-prev" v-on:click="playPrev"/>
          </div>
          <!-- 中间按钮 -->
          <div class="icon i-center" v-bind:class="disableBtnClass">
            <i v-bind:class="playIconClass" v-on:click="togglePlay"/>
          </div>
          <!-- 右侧按钮 -->
          <div class="icon i-right" v-bind:class="disableBtnClass">
            <i class="icon-next" v-on:click="playNext"/>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"/>
          </div>
        </div>
      </div>
    </div>

    <audio
      ref="audioRef"
      v-on:pause="onAudioPause"
      v-on:canplay="onSongReady"
      v-on:error="onSongError"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'

import useMode from './use-mode'

export default {
  name: 'MusicPlayer',
  setup () {
    // data ---------------------------------
    const isSongReady = ref(false)
    const audioRef = ref(null)

    // vuex ---------------------------------
    const store = useStore()
    const isFullScreen = computed(() => store.state.isFullScreen)
    const isPlaying = computed(() => store.state.isPlaying)
    const currentSong = computed(() => store.getters.currentSong)
    const currentIndex = computed(() => store.state.currentIndex)
    const playList = computed(() => store.state.playList)

    // computed ---------------------------------
    const playIconClass = computed(() => {
      return isPlaying.value ? 'icon-pause' : 'icon-play'
    })
    const disableBtnClass = computed(() => {
      // 如果audio正在加载歌曲，为上一首/下一首/播放按钮添加禁用样式
      return isSongReady.value ? '' : 'disable'
    })

    // hooks
    const {
      modeIcon, // computed:当前播放模式的按钮图标
      changeMode // methods:切换播放模式的函数
    } = useMode()

    // watch ---------------------------------
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      isSongReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })
    watch(isPlaying, (newPlayingState) => {
      // audio正在加载歌曲时，不允许切换播放/暂停
      if (!isSongReady.value) {
        return
      }
      const audioEl = audioRef.value
      newPlayingState ? audioEl.play() : audioEl.pause()
    })

    // methods ---------------------------------
    // 左上角返回按钮使用
    function goBack () {
      store.commit('setIsFullScreen', false)
    }
    // 播放键使用，切换播放/暂停状态
    function togglePlay () {
      // audio正在加载歌曲时，不允许切换播放/暂停
      if (!isSongReady.value) {
        return
      }
      store.commit('setIsPlaying', !isPlaying.value)
    }
    // audio dom的原生事件pause，有时可能audio因其他原因暂停了，但isPlaying状态没有同步修改造成出错
    function onAudioPause () {
      store.commit('setIsPlaying', false)
    }
    // 播放上一首歌
    function playPrev () {
      const list = playList.value
      let newIndex = currentIndex.value - 1

      // audio正在加载歌曲时，不允许切换歌曲
      if (!isSongReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        replay()
        return
      }

      if (newIndex < 0) {
        newIndex = list.length - 1
      }
      store.commit('setCurrentIndex', newIndex)
      // 如果点击播放上一首歌时为暂停状态，需要取消暂停
      if (!isPlaying.value) {
        store.commit('setIsPlaying', true)
      }
    }
    // 播放下一首歌
    function playNext () {
      const list = playList.value
      let newIndex = currentIndex.value + 1

      // 特殊情况
      if (!isSongReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        replay()
        return
      }

      if (newIndex >= list.length) {
        newIndex = 0
      }
      store.commit('setCurrentIndex', newIndex)
      // 如果点击播放上一首歌时为暂停状态，需要取消暂停
      if (!isPlaying.value) {
        store.commit('setIsPlaying', true)
      }
    }
    // 重新开始播放当前歌曲
    function replay () {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
    }
    // audio通知可播放
    function onSongReady () {
      if (isSongReady.value) {
        return
      }
      isSongReady.value = true
    }
    // audio通知加载歌曲出错，避免一直卡在isSongReady=false的状态不能切换
    function onSongError () {
      isSongReady.value = true
      console.warn('audio加载歌曲出错,当前歌曲=', currentSong)
    }

    return {
      // 计算属性
      isFullScreen,
      currentSong,
      playIconClass,
      disableBtnClass,
      modeIcon, // 来自use-mode的计算属性
      // ref
      audioRef,
      // methods
      goBack,
      togglePlay,
      onAudioPause,
      playPrev,
      playNext,
      onSongReady,
      onSongError,
      changeMode
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
