<template>
  <MyHeader/>
  <NavigationBar/>
  <router-view/>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue'
import NavigationBar from '@/components/NavigationBar.vue'
export default {
  components: {
    MyHeader,
    NavigationBar
  }
}
</script>
