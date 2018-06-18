import 'babel-polyfill'// ES6转换
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
// 引入全局样式
import 'common/stylus/index.styl'

Vue.config.productionTip = false

fastclick.attach(document.body)// 解决300ms延迟

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
