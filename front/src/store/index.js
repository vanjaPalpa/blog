import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth:{
      user:null,
      loggedIn:false
    },
    posts:null
  },
  getters:{
    getStatus(state){
      return state.auth.loggedIn
    },
    getUser(state){
      return state.auth.user.user
    },
    getToken(state){
      return state.auth.user.token
    },

    getAllPosts(state){
      return state.posts
    }
  },
  mutations: {
    setUser(state, user) {
      state.auth.user = user,
      state.auth.loggedIn = true
    },
    logout(state) {
      state.auth.user = null,
      state.auth.loggedIn = false
    },
    setPosts(state, posts) {
      state.posts = posts
    },
    addPost(state,post){
      state.posts.push(post)
    },
    editPost(state,post){
      Object.assign(state.posts, post)
    },
    deletePost(state,payload){
      const i = state.posts.map(item => item.id).indexOf(payload.id);
      state.posts.splice(i, 1);
    }
  },
  actions: {
    async login({commit},user){
      let response = await axios.post('/api/login', user)

      commit('setUser',response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      console.log('login succes')
    },
    async logout({commit},token){
      commit('logout')
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      let response = await axios.post('/api/logout')
      localStorage.removeItem('user')
      console.log(response.data.message)
      
    },
    async GetPosts({commit}){
      let response = await axios.get('/api/posts');
      commit('setPosts',response.data)
    },
    async AddPost({commit},data){
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
      console.log(data.post)
      let response = await axios.post('/api/posts', data.post)
      commit('addPost',response.data)
      console.log(response.data)
    },
    async editPost({commit},data){
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
      console.log(data)
      let response = await axios.put('/api/posts/'+data.post.id, data.post)
      console.log(response.data)
      commit('editPost',response.data)
      
    },
    async deletePost({commit},data){
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
      console.log(data)
      let response = await axios.delete('/api/posts/'+data.post.id)
      console.log(response)
      commit('deletePost',data.post)
    }
  },
  modules: {
  }
})
