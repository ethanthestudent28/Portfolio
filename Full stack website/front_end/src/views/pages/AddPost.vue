<template>
<div class="container">
<h1>Add post</h1>
<form class="d-flex flex-column" style="height: 500px;" @submit.prevent="submitPost">
    <label for="text">Enter Text: </label>
    <span class="container border border-dark border-2 rounded" style="height: 300px;">
    <input class="w-100 h-100 m-0 p-0 border-0 text-start object-fit-fill" autofocus style="width: 500px;" type="text" name="text" v-model="text">
    </span>
    <button class="btn w-25">Post</button>
</form>
</div>
</template>

<script>
import { postService } from '../../services/posts.service';

    export default {
        data(){
            return {
                text: "",
                error: "",
                post: 0
            }
        },
        methods: {
            submitPost(){
                const {error, text} = this

                if(!text) {
                    return
                }

                postService.addPost(text)
                .then((post) => {
                    this.post = post
                    console.log("Post created successfully", post.post_id)
                    this.$router.push("/posts/" + post.post_id)
                })
                .catch(error => {
                    this.error = error;
                })
            }
        }
    }
</script>