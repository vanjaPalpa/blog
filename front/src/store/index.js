import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth:{
      user:null,
      loggedIn:false
    }
  },
  getters:{

  },
  mutations: {
    setUser(state, user) {
      state.auth.user = user,
      state.auth.loggedIn = true
    },
    logout(state) {
      state.auth.user = null,
      state.auth.loggedIn = false
    }
  },
  actions: {
    async login({commit},user){
      let response = await axios.post('/api/login', user)

      commit('setUser',response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      console.log('login succes')
    },
    logout(){

    }
  },
  modules: {
  }
})
