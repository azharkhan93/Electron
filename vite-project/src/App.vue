<template>
      <nav v-if="showNavbar" class="navbar bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
      <div class="container">
        <a class="navbar-brand float-left"  target="_blank">
           E4HealthForEveryone
        </a>
        <ul class="nav navbar-nav flex-row float-right">
          
          <li class="nav-item">
            <router-link class="btn btn-outline-primary" to="/login">Sign in</router-link>
          </li>
          <li class="nav-item">
            <router-link class="btn btn-outline-primary" to="/">Sign up</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <!-- Main -->
    <div class="App">
      <div class="vertical-center">
        <div class="inner-block">
          <router-view></router-view>
        </div>
      </div>
    </div>
  <!-- </div> -->
</template>
  
<script >

export default {
  name: 'App',
  computed: {
    showNavbar() {
      
      return this.$route.name === 'customer';
    }
  },
}
</script>

<style scope >
/* 
.vertical-center {
  margin-bottom: 30px;
  width: 100%;
  height: 100%;
  background: rgba(34, 35, 58, 0.2);
} */
.vue-tempalte{
  background-color: white;
}
.nav-item {
  margin-left: 20px;
  /* padding-right: 50%; */
}
.navbar-light {
  background-color: blueviolet;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
}
@media (max-width: 600px) {
  .navbar-brand {
    font-size: 14px;
  }
  .nav-item {
    margin-left: 0;
  }
  .navbar-nav {
    display: flex;
    align-items: center;
  }
  .nav-item:first-child {
    margin-right: 10px;
  }
}
</style>
