import { createRouter, createWebHistory } from 'vue-router';

import Logout from "../views/components/Logout.vue"
import Login from "../views/pages/Login.vue"
import CreateUser from "../views/pages/CreateUser.vue"
import Home from "../views/pages/Home.vue"
import Profile from "../views/pages/Profile.vue"
import SinglePost from "../views/components/SinglePost.vue"
import AddPost from "../views/pages/AddPost.vue"
import GetUser from "../views/components/GetUser.vue"
import Search from "../views/pages/Search.vue"
import { userService } from "../services/users.service"

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/logout", component: Logout, beforeEnter: userService.ifAuthenticated},
    { path: "/create", component: CreateUser},
    { path: "/addpost", component: AddPost, beforeEnter: userService.ifAuthenticated},
    { path: "/posts/:id", component: SinglePost, props: true},
    { path: "/search", component: Search},
    { path: "/user/:id", component: GetUser, props: true},
    { path: "/profile", component: Profile, beforeEnter: userService.ifAuthenticated }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;