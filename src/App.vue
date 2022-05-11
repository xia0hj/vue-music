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
import { SEQUENCE_LIST_KEY, PLAY_LIST_KEY } from '@/assets/js/constant'
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
    window.addEventListener('storage', (e) => {
      switch (e.key) {
        case SEQUENCE_LIST_KEY: {
          this.$store.commit('setSequenceList', JSON.parse(e.newValue))
          break
        }
        case PLAY_LIST_KEY: {
          this.$store.commit('setPlayList', JSON.parse(e.newValue))
          break
        }
        default: {
          console.log(`监听到其他标签页修改了localStorage, key=${e.key}`)
        }
      }
      // console.log('localStorage发生变化', e)
    })
  }
}
</script>
