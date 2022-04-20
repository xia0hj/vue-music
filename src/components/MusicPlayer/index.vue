<template>
  <div class="player">
    <div
      class="normal-player"
      v-show="isFullScreen"
    >
      <div class="background">
        <img v-bind:src="currentSong.pic"/>
      </div>

      <div class="top">
        <div class="back" v-on:click="goBack"><i class="icon-back"/></div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
    </div>

    <audio ref="audioRef"/>
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
    const currentSong = computed(() => store.getters.currentSong)
    const audioRef = ref(null)

    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    // methods ---------------------------------
    function goBack () {
      store.commit('setIsFullScreen', false)
    }

    return {
      // 计算属性
      isFullScreen,
      currentSong,
      // ref
      audioRef,
      // methods
      goBack
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
  }
}
</style>
