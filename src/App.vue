<template>
  <div id="app" :class="[getColorScheme ? 'app-night' : 'app-day']">
    <Header />
    <router-view />
    <ErrorModal v-show="getError" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/Header.vue';
import ErrorModal from '@/components/modal/ErrorModal.vue';

const apiKey = process.env.VUE_APP_GOOGLE_API_KEY;

export default {
  name: 'app',
  components: {
    Header,
    ErrorModal,
  },
  head: {
    script: [
      {
        type: 'text/javascript',
        src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
        async: true,
      },
    ],
  },
  computed: mapGetters(['getColorScheme', 'getError']),
};
</script>

<style>
*,
html {
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
  background: #2c3e50;
}

.lock {
  overflow: hidden;
}

#app {
  color: #2c3e50;
  text-align: center;
  padding-bottom: 50px;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-night {
  /* background: linear-gradient(to bottom right, #151515, #504860) no-repeat; */
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)),
    url('./assets/images/night.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

.app-day {
  /* background: linear-gradient(to bottom right, #ffffff, #65a566) no-repeat; */
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)),
    url('./assets/images/morning.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 1200px) {
  #app {
    padding: 10px 10px 50px;
  }
}
</style>
