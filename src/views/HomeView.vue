<template>
  <div class="home container">
    <div class="home-top">
      <Input
        v-if="getArrayWeatherHome.length"
        :activeTab="activeTab"
        :key="activeTab"
        @updateArr="updateArr = !updateArr"
      />
      <div class="switcher-times">
        <button
          :class="{
            active: !switchDay,
          }"
          @click="showFiveDays"
        >
          Today
        </button>
        <button
          :class="{
            active: switchDay,
          }"
          @click="showOneDay"
        >
          Fives Days
        </button>
        <button class="btn-new" @click="addNewBlock">New</button>
      </div>
    </div>

    <div class="tabs" :key="getArrayWeatherHome.length">
      <div
        v-for="(item, index) in getArrayWeatherHome"
        :key="index + 'tabs' + updateArr"
        v-html="item.location"
        @click="activeTab = index"
        :class="{ active: index === activeTab }"
      ></div>
    </div>

    <div
      v-for="(item, index) in getArrayWeatherHome"
      :key="index + 'card' + updateArr"
    >
      <div class="home-wrapper" v-if="index === activeTab">
        <a href="#" class="remove" @click="removeBlock">
          <img src="../assets/icons/remove.svg" alt="remove" />
        </a>
        <a
          href="#"
          class="favorite"
          @click="switchFavorite(item.location)"
          :key="getFavorite.length"
        >
          <img
            v-if="!checkFavorite(item.location)"
            src="../assets/icons/favorite.svg"
            alt="favorite" />
          <img
            v-if="checkFavorite(item.location)"
            src="../assets/icons/favorite-active.svg"
            alt="favorite"
        /></a>
        <div>
          <Card v-if="!switchDay" :infoWeather="item" />
          <CardFiveDay
            v-if="switchDay"
            :infoWeather="getArrayWeatherCardFiveDaysHome[index]"
          />
          <div v-if="!switchDay" class="fon-card">
            <h2>Weather forecast for today</h2>
            <DayChart :data="getArrayWeatherHomeChartOneDay[index]"></DayChart>
          </div>
          <div v-if="switchDay" class="fon-card">
            <h2>Weather forecast for five days</h2>
            <WeekChart
              :data="getArrayWeatherHomeChartFiveDays[index]"
            ></WeekChart>
          </div>
        </div>
      </div>
    </div>

    <NewCard v-if="openModalNewCard" @closeModal="closeModalNewCard" />
    <ConfirmModal v-if="confirmModal" @closeModal="closeModalConfirmModal" />
    <Loader v-if="!getArrayWeatherHomeChartFiveDays.length" />
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Input from '@/components/Input.vue';
import Card from '@/components/Card.vue';
import CardFiveDay from '@/components/CardFiveDay.vue';
import DayChart from '@/components/DayChart.vue';
import WeekChart from '@/components/WeekChart.vue';
import NewCard from '@/components/modal/NewCard.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'HomeView',
  components: {
    Input,
    Loader,
    Card,
    CardFiveDay,
    DayChart,
    WeekChart,
    NewCard,
    ConfirmModal,
  },
  data: () => {
    return {
      switchDay: false,
      openModalNewCard: false,
      activeTab: 0,
      updateArr: false,
      confirmModal: false,
      localStorage: false,
    };
  },
  computed: mapGetters([
    'getUserInfo',
    'getWeatherForecast',
    'getWeatherForecastFiveDays',
    'getWeatherForecastOneDay',
    'getArrayWeatherHome',
    'getArrayWeatherHomeChartOneDay',
    'getArrayWeatherHomeChartFiveDays',
    'getFavorite',
    'getArrayWeatherCardFiveDaysHome',
  ]),
  methods: {
    ...mapActions([
      'fetchInfoUser',
      'fetchForecast',
      'fetchForecastFiveDays',
      'fetchForecastOneDay',
    ]),
    ...mapMutations([
      'setError',
      'pushArrayWeatherHome',
      'pushArrayWeatherHomeChartOneDay',
      'pushArrayWeatherHomeChartFiveDays',
      'removeArrayWeatherHome',
      'removeArrayWeatherHomeChartOneDay',
      'removeArrayWeatherHomeChartFiveDays',
      'pushFavorite',
      'removeFavorite',
      'updateFromLocalStorageFavorite',
      'getArrayWeatherCardFiveDays',
    ]),
    showOneDay() {
      if (!this.switchDay) this.switchDay = true;
    },
    showFiveDays() {
      if (this.switchDay) this.switchDay = false;
    },
    period(val) {
      let hour = new Date(val).getHours();
      return hour > 5 && hour < 18 ? 'day' : 'night';
    },
    addNewBlock() {
      this.openModalNewCard = true;
      let body = document.body.classList;
      body.add('lock');
    },
    closeModalNewCard() {
      this.openModalNewCard = false;
      let body = document.body.classList;
      body.remove('lock');
    },
    removeBlock() {
      if (this.getArrayWeatherHome.length === 1) {
        this.setError('You cannot remove the last element.');
        return;
      }
      this.confirmModal = true;
    },

    closeModalConfirmModal(val) {
      this.confirmModal = false;

      if (!val) return;

      this.removeArrayWeatherHome(this.activeTab);
      this.removeArrayWeatherHomeChartOneDay(this.activeTab);
      this.removeArrayWeatherHomeChartFiveDays(this.activeTab);

      this.updateArr = !this.updateArr;
      this.activeTab = 0;
    },

    switchFavorite(val) {
      if (this.getFavorite.length >= 5) {
        this.setError('Only 5 blocks can be added to favorite.');
      } else if (
        this.getFavorite.some((e) => e === val) &&
        this.getFavorite.length === 1
      ) {
        this.setError('You cannot remove the last item from your favorites.');
      } else if (this.getFavorite.some((e) => e === val)) {
        this.removeFavorite(this.activeTab);
        let arrForLocalStorage = this.getFavorite.map((e) => e + ';');
        window.localStorage.setItem('favorite', arrForLocalStorage);
      } else {
        this.pushFavorite(this.getArrayWeatherHome[this.activeTab].location);
        let arrForLocalStorage = this.getFavorite.map((e) => e + ';');
        window.localStorage.setItem('favorite', arrForLocalStorage);
      }
    },

    checkFavorite(val) {
      return this.getFavorite.some((e) => e === val);
    },
    checkLocalStorage() {
      if (localStorage.getItem('favorite')) {
        let arrForVuex = localStorage.getItem('favorite').split(';');
        arrForVuex.splice(arrForVuex.length - 1, 1);

        if (arrForVuex.length > 1) {
          arrForVuex = arrForVuex.map((e, index) => {
            if (index > 0) {
              return e.substr(1);
            }
            return e;
          });
        }

        this.updateFromLocalStorageFavorite(arrForVuex);
      }
    },
  },
  async mounted() {
    this.checkLocalStorage();

    if (this.getArrayWeatherHome.length) return;

    await this.fetchInfoUser();
    await this.fetchForecast(this.getUserInfo.city);
    await this.fetchForecastOneDay(this.getUserInfo.city);
    await this.fetchForecastFiveDays(this.getUserInfo.city);

    this.pushArrayWeatherHome(this.getWeatherForecast);
    this.pushArrayWeatherHomeChartOneDay(this.getWeatherForecastOneDay);
    this.pushArrayWeatherHomeChartFiveDays(this.getWeatherForecastFiveDays);
  },
};
</script>

<style scoped>
.home {
  margin: 30px auto 0;
}

h2 {
  color: #ffffff;
}

.home-wrapper {
  position: relative;
  margin-top: 20px;
  padding-top: 40px;
}

.home-wrapper .remove,
.home-wrapper .favorite {
  display: block;
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  height: 40px;
  opacity: 0.5;
}

.home-wrapper .favorite {
  right: auto;
  left: 0;
}

.home-wrapper .remove img,
.home-wrapper .favorite img {
  display: block;
  width: 40px;
  height: 40px;
}

.home-wrapper .favorite:hover,
.home-wrapper .remove:hover {
  opacity: 1;
}

.home-top {
  margin: 0 -20px 20px;
  background: #00000080;
  border-radius: 10px;
  padding: 20px;
}

.switcher-times {
  display: flex;
  margin: 20px 0;
}

.switcher-times button.active {
  background: #2196f3;
}

.switcher-times button {
  display: inline-block;
  min-width: 100px;
  margin-right: 20px;
  padding: 10px 12px;
  padding: 12px;
  border: 0 solid #000000;
  border-radius: 3px;
  background: #504860;
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  font-weight: 100;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.fon-card {
  background: #000000a8;
  padding: 40px 0 0 0;
  margin: 50px -20px 0;
  border-radius: 10px;
}

.switcher-times .btn-new {
  background: #b80811;
}

.tabs {
  display: flex;
  color: #ffffff;
  font-weight: bold;
  flex-wrap: wrap;
}

.tabs div {
  padding: 10px 12px;
  margin: 0 5px 0 0;
  background: #00000080;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  cursor: pointer;
}

.tabs div.active {
  background: #ffffff80;
}

@media (max-width: 425px) {
  .switcher-times button {
    margin-right: 10px;
    padding: 8px;
    min-width: 90px;
  }

  .fon-card {
    padding: 10px;
  }
}
</style>
