<template>
  <AppHeader/>
  <NavigationBar/>
  <router-view/>
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
  }
}
</script>
