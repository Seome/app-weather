import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'Home' }
  },
  {
    path: '/app-weather/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/app-weather/favorites',
    name: 'favorites',
    component: () => import(/* webpackChunkName: "about" */ '../views/FavoritesView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
