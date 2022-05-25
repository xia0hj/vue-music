<template>
  <AppHeader/>
  <NavigationBar/>
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive>
        <component :style="viewStyle" :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <MusicPlayer/>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import NavigationBar from '@/components/NavigationBar'
import MusicPlayer from '@/components/MusicPlayer'
import { STOP_KEY } from '@/assets/js/constant'

export default {
  components: {
    AppHeader,
    NavigationBar,
    MusicPlayer
  },
  computed: {
    viewStyle: function () {
      // 底部播放器的高度，如果播放列表不为空，则router-view页面要往上移给底部播放器挪位置
      const bottom = this.$store.state.playList.length ? '60px' : '0'
      return {
        bottom
      }
    }
  },
  mounted () {
    console.log(this._uid)
    window.addEventListener('storage', this.localStorageCallback)
  },
  unmounted () {
    window.removeEventListener('storage', this.localStorageCallback)
  },
  methods: {
    localStorageCallback (e) {
      switch (e.key) {
        case STOP_KEY: {
          this.$store.commit('setIsPlaying', false)
          console.log(`监听到其他标签页修改了localStorage. key=${e.key}`)
          break
        }
        default: {
          console.log(`监听到其他标签页修改了localStorage. key=${e.key}`)
          break
        }
      }
    }
  }
}
</script>
