<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <h1>This is an Admin page</h1>
        <h2 v-if="user"> connecter</h2>
        <h2 v-else >non connecter</h2>
        <form v-if="user == null" class="mt-8 space-y-6" @submit.prevent="login">
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

        <button v-if="user" @click="logout">logout</button>

        <div>
          <input v-model="CreatePost.title" type="text">
          <textarea v-model="CreatePost.content" name="" id="" cols="30" rows="3"></textarea>
          <button @click="add">Ajouter</button>
        </div>
        <div v-if="editFlag">
          <input v-model="editPost.title" type="text">
          <textarea v-model="editPost.content" name="" id="" cols="30" rows="3"></textarea>
          <button @click="editRequest" >Update</button>
        </div>

        <table v-if="user" class="table-auto">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Contenue</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" v-bind:key="post.id">
              <td>{{ post.title }}</td>
              <td>{{ post.content }}</td>
              <td><button @click="edit(post)">modifier</button></td>
              <td><button @click="deletePost(post.id)">supprimer</button></td>
            </tr>
          </tbody>
        </table>

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
      user:null,
      posts: null,
      CreatePost:{title:null,content:null},
      editFlag:false,
      editPost:{id:null,title:null,content:null}
    }
  },
  async mounted(){
    this.user = JSON.parse(localStorage.getItem('user'));
    let response = await axios.get('/api/posts');

    this.posts = response.data
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
      localStorage.removeItem('user')
      this.user = null

      console.log(r.data.message)
    },
    edit(post){
      this.editFlag = true;
      this.editPost = post
      console.log('le post id est ' +post.content)
    },
    async editRequest(){
      let user = JSON.parse(localStorage.getItem('user'));
      console.log(user.token)
      let tokenbear = user.token
      axios.defaults.headers.common.Authorization = `Bearer ${tokenbear}`

      let response = await axios.put('/api/posts/'+this.editPost.id, this.editPost)

      console.log(response)
      this.editFlag = false;


    },
    async add(){
      let user = JSON.parse(localStorage.getItem('user'));
      console.log(user.token)
      let tokenbear = user.token
      axios.defaults.headers.common.Authorization = `Bearer ${tokenbear}`
      let response = await axios.post('/api/posts', this.CreatePost)
      console.log(response.data)
    },
    async deletePost(id){
      let user = JSON.parse(localStorage.getItem('user'));
      console.log(user.token)
      let tokenbear = user.token
      axios.defaults.headers.common.Authorization = `Bearer ${tokenbear}`

      let response = await axios.delete('/api/posts/'+id)

      console.log(response)
    }
  }
}
</script>
