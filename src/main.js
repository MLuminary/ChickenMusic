import 'babel-polyfill'// ES6转换
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
// 引入全局样式
import 'common/stylus/index.styl'

Vue.config.productionTip = false

fastclick.attach(document.body)// 解决300ms延迟

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
