<template>
    <div class="mx-auto p-2">
    <h1 style="width: 500px;">Welcome to Chirrup!</h1>
    <SinglePost :id="this.post_id"></SinglePost>
    </div> 
</template>

<script>
    import SinglePost from "../components/SinglePost.vue"

    export default {
        data() {
            return {
                posts: [],
                error: "",
                loading: true,
                post_id: 2 //Placeholder value
            }
        },
        components: {
            SinglePost
        }
    }

</script>
