<template>
    <div class="d-flex ms-1">
        <p class="mt-3 me-auto">{{ user.first_name + " " + user.last_name + " (" + user.username + ")" }} </p>

        <button class="btn my-0" @click="followUser">Follow</button>
        <button class="btn my-0" @click="unfollowUser">Unfollow</button>
    </div>

    <div v-if="error">{{ error }}</div>

    <div id="followers">
        <p>Followers: </p>
        <ul class="list-group" v-if="user.followers.length">
            <li class="list-group-item" v-for="follower in user.followers" :key="follower.user_id">
                <a class="btn" :href="'/user/' + follower.user_id">{{ follower.username }}</a>
            </li>
        </ul>
    </div>

    <div id="following">
        <p>Following: </p>
        <ul class="list-group" v-if="user.following.length">
            <li class="list-group-item" v-for="following in user.following" :key="following.user_id">
                <a class="btn" :href="'/user/' + following.user_id">{{ following.username }}</a>
            </li>
        </ul>
    </div>

    <p>Posts: </p>
    <ul class="list-group" v-if="user.posts.length">
        <li class="list-group-item" v-for="post in user.posts" :key="post.post_id">
            <SinglePost :id="post.post_id"></SinglePost>
        </li>
    </ul>
</template>

<script>
import { socialService } from '../../services/social.service';
import SinglePost from "../components/SinglePost.vue"

export default {
    data() {
        return {
            user: [], 
            error: ""
        }
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    methods: {
        followUser() {
            socialService.followUser(parseInt(this.id))
                .then((follow) => {
                    console.log("User followed")
                    this.$router.go(0);
                })
                .catch(error => this.error = error)
        },
        unfollowUser() {
            socialService.unfollowUser(parseInt(this.id))
                .then((unfollow) => {
                    console.log("User unfollowed")
                    this.$router.go(0);
                })
        }
    },
    created() {
        this.user.loading = true;
        socialService.getUser(parseInt(this.id))
            .then((user) => {
                this.user = user;
            })
            .catch((error) => this.error = error)
    },
    components: {
        SinglePost
    }
}
</script>