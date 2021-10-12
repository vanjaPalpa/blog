<template>
  <div class="admin">
    <h1>This is an Admin page</h1>
    <form @submit.prevent="login">
      <div>
        <input type="text" v-model="form.email">
        <span v-if="errors.email">{{ errors.email[0] }}</span>
      </div>
      <div>
        <input type="text" v-model="form.password">
        <span v-if="errors.password">{{ errors.password[0] }}</span>
      </div>
      <button type="submit">se connecter</button>
    </form>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data(){
    return{
      form:{email:null,password:null},
      errors:{}
    }
  },
  methods:{
    async login(){
      try {
        await axios.get('/sanctum/csrf-cookie')
        // await axios.post('/login', this.form)

        let response = await axios.get('/api/user');
        console.log(response);
        
      } catch (error) {
        this.errors = error.response.data.errors
      }
    }
  }
}
</script>
