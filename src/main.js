import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Home from './views/Home'
import Room from './views/Room'
import store from './store'
import Notifications from 'vue-notification'
import _ from "lodash"


import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
UIkit.use(Icons)
Vue.use(Notifications)
Vue.prototype._ = _

Vue.config.productionTip = false
Vue.component('home', Home)
Vue.component('room', Room)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
