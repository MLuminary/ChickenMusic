import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

import createLogger from 'vuex/dist/logger' // 修改 state 时会打印日志

Vue.use(Vuex) // 注册插件

const debug = process.env.NODE_ENV !== 'production' // 开发模式启动 debug

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
