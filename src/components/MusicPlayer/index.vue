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
            <i class="icon-sequence"/>
          </div>
          <div class="icon i-left">
            <i class="icon-prev" v-on:click="playPrev"/>
          </div>
          <!-- 中间按钮 -->
          <div class="icon i-center">
            <i v-bind:class="playIconClass" v-on:click="togglePlay"/>
          </div>
          <!-- 右侧按钮 -->
          <div class="icon i-right">
            <i class="icon-next" v-on:click="playNext"/>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"/>
          </div>
        </div>
      </div>
    </div>

    <audio ref="audioRef" v-on:pause="onAudioPause"/>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'

export default {
  name: 'MusicPlayer',
  setup () {
    const store = useStore()
    const isFullScreen = computed(() => store.state.isFullScreen)
    const isPlaying = computed(() => store.state.isPlaying)
    const currentSong = computed(() => store.getters.currentSong)
    const currentIndex = computed(() => store.state.currentIndex)
    const playList = computed(() => store.state.playList)
    const playIconClass = computed(() => {
      return isPlaying.value ? 'icon-pause' : 'icon-play'
    })
    const audioRef = ref(null)

    // watch ---------------------------------
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })
    watch(isPlaying, (newPlaying) => {
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    // methods ---------------------------------
    // 左上角返回按钮使用
    function goBack () {
      store.commit('setIsFullScreen', false)
    }
    // 播放键使用，切换播放/暂停状态
    function togglePlay () {
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

      // 特殊情况
      if (!list.length) {
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
      if (!list.length) {
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

    return {
      // 计算属性
      isFullScreen,
      currentSong,
      playIconClass,
      // ref
      audioRef,
      // methods
      goBack,
      togglePlay,
      onAudioPause,
      playPrev,
      playNext
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
