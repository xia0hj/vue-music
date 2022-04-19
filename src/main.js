// 框架
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 第三方
import lazyPlugin from 'vue3-lazy'
// 本项目
import loadingDirective from '@/components/BaseLoading/directive'
import noResultDirective from '@/components/BaseNoResult/directive'
import '@/assets/scss/index.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, { loading: require('@/assets/image/default.png') }) // 全局注册了一个v-lazy指令
  .directive('loading', loadingDirective) // 全局注册自定义的v-loading指令
  .directive('no-result', noResultDirective) // 全局注册自定义的v-no-result指令
  .mount('#app')
