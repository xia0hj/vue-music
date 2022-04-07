import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import lazyPlugin from 'vue3-lazy'

import '@/assets/scss/index.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, { loading: require('@/assets/image/default.png') }) // 全局注册了一个v-lazy指令
  .mount('#app')
