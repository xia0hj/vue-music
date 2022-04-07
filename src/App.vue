<template>
  <app-header/>
  <navigation-bar/>
  <router-view/>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import NavigationBar from '@/components/NavigationBar'
export default {
  components: {
    'app-header': AppHeader,
    'navigation-bar': NavigationBar
  }
}
</script>
