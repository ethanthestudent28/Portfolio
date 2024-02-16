<template>

</template>

<script>
import { userService } from '../../services/users.service';

    export default {
        created() {
            userService.logout()
            .then(result => {
                console.log("Logout Successful");
                this.$router.push("/");
            })
            }
        }
</script>