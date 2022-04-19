import { createApp } from 'vue'
import { addStyleClass, removeStyleClass } from '@/assets/js/dom-methods'

// 修改css的position为relative的class，定义在base.scss中
const relativeStyleClass = 'g-relative'

export default function createLoadingLikeDirective (component) {
  const append = (el) => {
    const style = getComputedStyle(el)
    // 检查dom的样式position是否属于以下其中之一，如果不属于则需要为其修改样式，让loading图能够在正中心显示
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addStyleClass(el, relativeStyleClass)
    }
    el.appendChild(el.loadingInstance.$el)
  }
  const remove = (el) => {
    removeStyleClass(el, relativeStyleClass)
    el.removeChild(el.loadingInstance.$el)
  }

  return {
    // el指向v-loading指令作用的dom
    // binding.value指向v-loading="isLoading"中isLoading这个变量
    mounted: function (el, binding) {
      const app = createApp(component)
      const loadingInstance = app.mount(document.createElement('div'))
      el.loadingInstance = loadingInstance // 将loading的div实例保存到el对象上，让updated函数中能够通过el取得div

      // 从动态参数中取加载的提示文本
      const loadingText = binding.arg
      if (typeof loadingText !== 'undefined') {
      // 调用BaseLoading组件中的setTitle方法
        el.loadingInstance.setTitle(loadingText)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated: function (el, binding) {
      const loadingText = binding.arg
      if (typeof loadingText !== 'undefined') {
        el.loadingInstance.setTitle(loadingText)
      }
      if (binding.value !== binding.oldValue) {
        if (binding.value === true) {
          append(el)
        } else if (binding.value === false) {
          remove(el)
        }
      }
    }
  }
}
