<template>
    <h1 class="text-center">Login</h1>
    <div class="container" style="height: 200px;">
    <form class="d-flex flex-column justify-content-center align-items-center m-1" @submit.prevent="handleSubmit">
        <input type="username" name="username" placeholder="Username" v-model="username" />
        <input class="my-1" type="password" name="password" placeholder="Password" v-model="password" />
        <div v-show="submitted && !username">Username is required</div>
        <div v-show="submitted && !password">Password is required</div>
        <button class="btn btn-primary btn-sm">Login</button>
        <div v-if="error">{{ error }}</div>
    </form>
    </div>
</template>

<script>
import { userService } from "../../services/users.service.js"

    export default {
        data(){
            return {
                username: "",
                password: "",   
                submitted: false,
                error: ""
            }
        },
        methods: {
            handleSubmit(e) {
                this.submitted = true
                this.error = ""
                const {username, password} = this

                if(!(username && password)) {
                    return;
                }

                const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,16}$/ //One uppercase, lowercase, special and number required with a min length of 8 and a max of 16
                if(!(password_pattern.test(password))) {
                    this.error = "Password is not strong enough"
                    return;
                }
                
                userService.login(username, password)
                .then(result => {
                    console.log("Auth successful")
                    this.$router.push("/")
                })
                .catch(err => {
                    this.error = err;
                    this.submitted = false;
                })
            }
        }
    }
</script>