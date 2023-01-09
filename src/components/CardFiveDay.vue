<template>
  <div class="card-five">
    <div v-for="item in infoWeather" :key="item.date + 'five'">
      <Card :infoWeather="item" />
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card.vue';

export default {
  name: 'CardFiveDay',
  components: {
    Card,
  },
  props: {
    infoWeather: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.card-five {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.card-five >>> .card {
  margin: 10px 5px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)),
    url('../assets/images/morning.png');
}
.card-five >>> h4 {
  display: block;
}
</style>
