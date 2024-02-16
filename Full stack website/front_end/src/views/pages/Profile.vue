<template>
    <div>
        <p v-if="user.loading">Loading user profile...</p>
        <GetUser :id="getUserID()"></GetUser>
        <p v-if="error"></p>
    </div>

</template>

<script>
import GetUser from "../components/GetUser.vue"

export default {
    data(){
        return{
            user: [],
            error: "",
        }
    }, methods: {
        getUserID() {
            return localStorage.getItem("user_id");
        }
    },
    components: {
        GetUser
    }
}
</script>