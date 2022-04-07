import { createApp } from 'vue'
import BaseLoading from './index.vue'

const append = (el) => {
  el.appendChild(el.loadingDiv.$el)
}
const remove = (el) => {
  el.removeChild(el.loadingDiv.$el)
}

const loadingDirective = {
  // el指向v-loading指令作用的dom
  // bind.value指向v-loading="isLoading"中isLoading这个变量
  mounted: function (el, isLoading) {
    const app = createApp(BaseLoading)
    const loadingDiv = app.mount(document.createElement('div'))
    el.loadingDiv = loadingDiv // 将loading的div实例保存到el对象上，让updated函数中能够通过el取得div
    if (isLoading.value) {
      append(el)
    }
  },
  updated: function (el, isLoading) {
    if (isLoading.value !== isLoading.oldValue) {
      if (isLoading.value === true) {
        append(el)
      } else if (isLoading.value === false) {
        remove(el)
      }
    }
  }
}

export default loadingDirective
