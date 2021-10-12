<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <h1>This is an Admin page</h1>
        <h2 v-if="user"> connecter</h2>
        <h2 v-else >non connecter</h2>
        <form class="mt-8 space-y-6" @submit.prevent="login">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input type="text" v-model="form.email" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
            <span v-if="errors.email">{{ errors.email[0] }}</span>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input type="text" v-model="form.password" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
            <span v-if="errors.password">{{ errors.password[0] }}</span>
          </div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">se connecter</button>
        </form>

        <button @click="logout">logout</button>

      </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  data(){
    return{
      form:{email:null,password:null},
      errors:{},
      user:null
    }
  },
  methods:{
    async login(){
      try {
        await axios.get('/sanctum/csrf-cookie')
        let rs = await axios.post('/api/login', this.form)

        let token = rs.data.token
        console.log(token);
        this.user = rs.data
        localStorage.setItem('user', JSON.stringify(rs.data));

        let response = await axios.get('/api/user',{headers: {'Authorization': `Bearer ${token}`}})

        console.log(response)

        
      } catch (error) {
        this.errors = error.response.data.errors
      }
    },
    async logout(){
      let user = JSON.parse(localStorage.getItem('user'));
      console.log(user.token)
      let tokenbear = user.token
      axios.defaults.headers.common.Authorization = `Bearer ${tokenbear}`
      await axios.get('/sanctum/csrf-cookie')
      let r = await axios.post('/api/logout')

      console.log(r.data.message)
    }
  }
}
</script>
