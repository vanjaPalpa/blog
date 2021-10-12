<template>
  <div class="home">
    <HelloWorld msg="Listes des artilces"/>
    <div v-for="post in posts" v-bind:key="post.id">
      <div><a :href="/show/ + post.id">{{ post.title }}</a></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data(){
    return {
      posts:null
    }
  },
  async mounted(){
    let response = await axios.get('/api/posts');

    this.posts = response.data
  }
}
</script>
