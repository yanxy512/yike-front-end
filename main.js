import App from './App'
import store from './store'
import {createSSRApp} from 'vue'
import io from 'components/socket/weapp.socket.io.js'

Vue.prototype.socket = io('http://localhost:8082')

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  return {
    app
  }
}
// #endif