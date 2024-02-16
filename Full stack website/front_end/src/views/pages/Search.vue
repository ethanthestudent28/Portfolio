<template>
    <div class="container">
        <h1 class="">Results</h1>
        <em v-if="users.loading">Loading Users...</em>
        <div class="container d-flex bp-2 mb-2 bg-dark-subtle rounded" v-else>
            <ul class="list-group-flush">
                <li class="list-group-item border-bottom border-dark" v-for="user in users" :key="user.user_id">
                    <a class="btn btn-outline-secondary border-0 link-underline link-underline-opacity-0" :href="'/user/' + user.user_id">{{ user.first_name + " " + user.last_name + " (" + user.username + ")" }}</a>
                </li>
            </ul>
            <div v-if="user_info" class="d-flex flex-grow flex-fill m-3 bg-secondary"></div>
        </div>
    </div>
</template>

<script>
import { socialService } from '../../services/social.service'
import SinglePost from "../components/SinglePost.vue"

export default {
    data() {
        return {
            users: [],
            user_info: [],
            error: "",
            query: "",
            user_id: 0
        }
    },
    methods: {
        findUserPost(user_id) { //Finds users most recent post to show on search

        }
    },
    mounted() {
        console.log(this.$route.query.q)
        this.users.loading = true;
        this.query = this.$route.query.q
        console.log(this.query)
        socialService.search(this.query)
            .then((users) => {
                this.users = users
            })
            .catch(error => this.error = error)
    },
    components: {
        SinglePost
    }
}
</script>