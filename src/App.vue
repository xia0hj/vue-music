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
  }
}
</script>
