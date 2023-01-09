<template>
  <section>
    <div class="location">{{ location }}</div>
    <div class="weather__description">{{ description }}</div>
    <img class="weather__icon" :src="icon" :alt="description" />
  </section>
</template>

<script>
export default {
  name: 'Weather',

  props: {
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    icon: '',
  }),

  methods: {
    getWeatherIcon() {
      if (this.description.includes('storm')) {
        this.icon = require('@/assets/icons/weather/thunderstorm.svg');
      } else if (this.description.includes('rain')) {
        this.icon = require('@/assets/icons/weather/rain.svg');
      } else if (this.description.includes('snow')) {
        this.icon = require('@/assets/icons/weather/snow.svg');
      } else if (this.description.includes('clear')) {
        this.icon = require('@/assets/icons/weather/sun.svg');
      } else {
        this.icon = require('@/assets/icons/weather/cloud.svg');
      }
    },
  },

  mounted() {
    this.getWeatherIcon();
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.location {
  text-transform: uppercase;
  font-weight: bold;
}

.weather__description {
  text-transform: lowercase;
  margin-left: 10%;
  margin-right: 10%;
  text-align: center;
}

.weather__description:first-letter {
  text-transform: uppercase;
}

.weather__icon {
  margin-top: 20px;
  width: 120px;
  padding-bottom: 40px;
}
</style>
