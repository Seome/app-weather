import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from './userInfo'
import weatherForecast from './weatherForecast'
import favorite from './favorite'
import error from './error'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    userInfo,
    weatherForecast,
    favorite,
    error
  }
})
