<template>
  <my-header/>
  <navigation-bar/>
  <router-view/>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue'
import NavigationBar from '@/components/NavigationBar.vue'
export default {
  components: {
    'my-header': MyHeader,
    'navigation-bar': NavigationBar
  }
}
</script>
