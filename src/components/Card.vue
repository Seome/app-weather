<template>
  <div
    class="card"
    :class="[period(infoWeather.date, infoWeather.timezone)]"
    v-if="infoWeather.location"
    :key="infoWeather.location"
  >
    <h4 v-html="infoWeather.date"></h4>
    <Measurements
      :cloudiness="infoWeather.cloudiness"
      :windSpeed="infoWeather.windSpeed"
      :humidity="infoWeather.humidity"
    ></Measurements>

    <Temperature
      :value="infoWeather.temperatureValue"
      :high="infoWeather.temperatureHigh"
      :low="infoWeather.temperatureLow"
    ></Temperature>

    <Weather
      :location="infoWeather.location"
      :description="infoWeather.description"
    ></Weather>
  </div>
</template>

<script>
import Weather from '@/components/cardItem/Weather.vue';
import Temperature from '@/components/cardItem/Temperature.vue';
import Measurements from '@/components/cardItem/Measurements.vue';

export default {
  name: 'Card',
  components: {
    Weather,
    Temperature,
    Measurements,
  },
  props: {
    infoWeather: {
      type: Object,
      required: true,
    },
  },
  methods: {
    period(val, timezone) {
      let hour = new Date().getUTCHours();
      hour = timezone / 3600 + hour;
      return hour > 6 && hour < 18 ? 'day' : 'night';
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  margin: 40px auto 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
}

h4 {
  display: none;
}

.card.day {
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)),
    url('../assets/images/morning.png');
  color: rgba(255, 255, 255, 0.9);
}

.card.night {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('../assets/images/night.png');
  color: rgba(255, 255, 255, 0.9);
}

.card {
  width: 210px;
  height: 450px;
  border-radius: 5px;
}
</style>
