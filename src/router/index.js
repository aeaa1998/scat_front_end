import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/room',
    name: 'Room',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "room" */ '../views/Room.vue'),
    beforeEnter: (to, from, next) => {
      if(store.getters["scat/logged"] == null || store.getters["scat/logged"] == false){
        next("/")
      }else{
        next()
      }
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
