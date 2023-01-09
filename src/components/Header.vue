<template>
  <header class="container">
    <div class="header">
      <div class="logo">
        <img src="../assets/logo.png" alt="Logo" />
      </div>
      <div class="main-nav">
        <nav>
          <router-link to="/">Home</router-link> |
          <router-link to="/favorites">Favorites</router-link>
        </nav>
        <SwithchColorScheme />
      </div>
    </div>
  </header>
</template>

<script>
import SwithchColorScheme from '@/components/SwithchColorScheme.vue';

export default {
  name: 'Header',
  components: {
    SwithchColorScheme,
  },
};
</script>
<style scoped>
header {
  background: #00000080;
  border-radius: 10px;
  padding-top: 20px;
}

.logo img {
  width: 150px;
}

.main-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

nav {
  padding: 10px 0;
  color: #ffffff;
}

.app-night nav {
  color: #ffffff;
}

nav a {
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
}

.app-night nav a {
  color: #ffffff;
}

nav a.router-link-exact-active {
  color: #2196f3;
}

.app-night nav a.router-link-exact-active {
  color: #2196f3;
}
</style>
