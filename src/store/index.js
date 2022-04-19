import { createStore, createLogger } from 'vuex'

import state from './state.js'
import * as getters from './getters.js'
import mutations from './mutations.js'
import * as actions from './actions.js'

const isDev = process.env.NODE_ENV !== 'production'

export default createStore({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
  strict: isDev, // 严格模式，会有警告和性能损耗，只在开发模式中开启
  plugins: isDev ? [createLogger()] : []
})
