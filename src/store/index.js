
import Vue from 'vue'
import Vuex from 'vuex'
import scat from './scat'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)



export default new Vuex.Store({
  modules: {
    scat
  }
})