<template>
    <div>
        <em v-if="post.loading">Loading post...</em>

        <div class="card border m-1 p-2 " v-else>
            <div class="card-header">
                <a class="btn btn-outline-0 btn-border-0 btn-sm" :href="'/user/' + post.author.user_id">Author:
                    {{
                        post.author.first_name + " " + post.author.last_name }}</a>
            </div>

            <div class="card-body">
                <p> {{ post.text }}</p>
            </div>
            <div class="d-flex card-footer text-body-secondary">
                <p>Date: {{ formatted_date }}</p>
                <p class="ms-2">Number of Likes: {{ post.likes.length }}</p>
            </div>

            <div class="d-flex mt-1 ms-3">
                <button class="btn btn-secondary btn-sm" @click="likePost">Like</button>
                <button class="btn btn-secondary mx-1 btn-sm" @click="unlikePost">Unlike</button>


                <div class="btn-group dropdown" data-bs-toggle="dropdown" v-if="ifAuthor() == post.author.user_id">
                    <button class="btn dropdown-toggle" type="button"></button>
                    <ul class="dropdown-menu">
                        <li><button class="dropdown-item btn" @click="deletePost">Delete</button></li>
                        <li><button class="dropdown-item btn" data-bs-toggle="collapse" data-bs-target="#editPost"
                                aria-expanded="false" aria-controls="editPost">Edit Post</button></li>
                    </ul>
                </div>
            </div>
            <form class="collapse" id="editPost" @submit.prevent="updatePost">
                <button class="btn btn-secondary my-1 mx-3">Edit Post</button>
                <input name="new_post" type="new_post" v-model="new_post">
                
            </form>
        </div>

        <div v-if="error">
            {{ error }}
        </div>
    </div>
</template>

<script>
import { postService } from '../../services/posts.service';

export default {
    data() {
        return {
            post: [],
            error: "",
            formatted_date: "",
            new_post: "",
        }
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    methods: {
        likePost() {
            postService.likePost(parseInt(this.id))
                .then((like) => {
                    console.log("Post liked");
                    this.$router.go(0);
                })
                .catch(error => this.error = error);
        },
        unlikePost() {
            postService.unlikePost(parseInt(this.id))
                .then((unlike) => {
                    console.log("Post unliked");
                    this.$router.go(0);
                })
                .catch(error => this.error = error);
        },
        updatePost() {
            postService.updatePost(parseInt(this.id), this.new_post)
                .then((edit) => {
                    console.log("Edited post")
                    this.$router.go(0);
                })
                .catch(error => this.error = error)
        },
        deletePost() {
            if (confirm("Are you sure you want to delete this post?")) {
                postService.deletePost(parseInt(this.id))
                    .then((del) => {
                        console.log("Post deleted")
                        this.$router.push("/")
                    })
            }
        },
        ifAuthor() {
            return localStorage.getItem("user_id")
        }
    },
    created() {
        this.post.loading = true;
        postService.getPost(parseInt(this.id))
            .then((post) => {
                this.post = post;
                let date = new Date(post.timestamp)
                this.formatted_date = date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear();
            })
            .catch(error => this.error = error);
    }
}
</script>