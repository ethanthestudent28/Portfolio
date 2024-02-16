<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <router-link to="/" class="navbar-brand">
      <img src="../logo.png" alt="logo" width="30" height="24" class="d-inline-block align text top">
      Chirrup</router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link to="/" class="nav-link active" aria-current="page">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">Profile</router-link>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            More
          </a>
          <ul class="dropdown-menu">
            <li><router-link to="/addpost" class="dropdown-item" >Make a post!</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><router-link to="/create" class="dropdown-item">Create an account</router-link></li>
          </ul>
        </li>
        <li class="nav-item">
          <router-link v-if="!login" to="/login" class="nav-link" aria-disabled="true">Login</router-link>
          <router-link v-else-if="login" to="/logout" class="nav-link" aria-disabled="true">Logout</router-link>
        </li>
      </ul>
      <form class="d-flex" role="search">
        <input class="form-control me-2" v-model="query" name="q" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" @click="handleSearch" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>

<router-view/>
</template>

<script>

export default {
  data() {
    return {
      query: "",
      login: false
    }
  }, methods: {
    loggedIn() {
      if(localStorage.getItem("session_token")) {
        this.login = true;
      } else {
        this.login = false;
      }
    },
    handleSearch() {
      const query = this.$route.query.q;
      this.$router.push("/search?q=" + query);
    }
  },
  mounted() {
    this.loggedIn();
  }
}
</script>
