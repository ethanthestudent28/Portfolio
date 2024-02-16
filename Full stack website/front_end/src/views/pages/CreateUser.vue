<template>
    <h1 class="text-center">Create an account</h1> 
    <div class="d-flex justify-content-center">
    <form class="d-flex flex-column" @submit.prevent="handleSubmit">
        <input type="first_name" name="first_name" placeholder="First Name" v-model="first_name" />
        <input type="last_name" name="last_name" placeholder="Last Name" v-model="last_name" />
        <input type="username" name="username" placeholder="Username" v-model="username" />
        <input type="password" name="password" placeholder="Password" v-model="password" />
        <button class="btn ms-auto">Submit</button>
        <div v-if="error">{{ error }}</div>
    </form>
    </div>
</template>

<script>
import { userService } from '../../services/users.service';

    export default {
        data() {
            return{
                first_name: "",
                last_name: "",
                username: "",
                password: "",
                submitted: false,
                error: ""
            }
        },
        methods: {
            handleSubmit(e) {
                this.submitted = true;
                this.error = "";
                const {first_name, last_name, username, password} = this;

                if(!(first_name && last_name && username && password)) {
                    return;
                }

                const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,16}$/ //One uppercase, lowercase, special and number required with a min length of 8 and a max of 16
                if(!(password_pattern.test(password))) {
                    this.error = "Password is not strong enough"
                    return;
                }

                userService.createUser(first_name, last_name, username, password)
                .then(result => {
                    console.log("User created successfully")
                    this.$router.push("/");
                })
                .catch(err => {
                    this.error = err;
                    this.submitted = false;
                })
            }
        }
    }
</script>