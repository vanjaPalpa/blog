<template>
    <div>
        <div>{{ postShow.title }}</div>
        <div>{{ postShow.content }}</div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    data(){
        return{
            postShow: null
        }
    },
    async mounted(){
        let response = await axios.get('/api/posts/'+this.$route.params.id);

        this.postShow = response.data
    }
}
</script>