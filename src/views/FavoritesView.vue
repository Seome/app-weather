<template>
  <div class="favorite container" :key="getFavorite.length">
    <div class="favorite-top">
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

    <h2 v-if="getWeatherForecastFavorite.length === 0">
      Add first block to favorites...
    </h2>

    <div
      class="tabs"
      :key="getWeatherForecastFavorite.length + getFavorite.length"
    >
      <div
        v-for="(item, index) in getWeatherForecastFavorite"
        :key="index + 'tabs' + updateArr"
        v-html="item.location"
        @click="activeTab = index"
        :class="{ active: index === activeTab }"
      ></div>
    </div>

    <div
      v-for="(item, index) in getWeatherForecastFavorite"
      :key="index + 'card' + updateArr + getFavorite.length"
    >
      <div class="favorite-wrapper" v-if="index === activeTab">
        <a href="#" class="remove" @click="removeBlock">
          <img src="../assets/icons/remove.svg" alt="remove" />
        </a>
        <a href="#" class="favorite" :key="getFavorite.length">
          <img src="../assets/icons/favorite-active.svg" alt="favorite"
        /></a>
        <div>
          <Card v-if="!switchDay" :infoWeather="item" />
          <CardFiveDay
            v-if="switchDay"
            :infoWeather="getArrayWeatherCardFiveDays[index]"
          />
          <div v-if="!switchDay" class="fon-card">
            <h2>Weather forecast for today</h2>
            <DayChart
              v-if="getWeatherForecastOneDayFavorite.length"
              :data="getWeatherForecastOneDayFavorite[index]"
            ></DayChart>
          </div>
          <div v-if="switchDay" class="fon-card">
            <h2>Weather forecast for five days</h2>
            <WeekChart
              v-if="getWeatherForecastFiveDaysFavorite.length"
              :data="getWeatherForecastFiveDaysFavorite[index]"
            ></WeekChart>
          </div>
        </div>
      </div>
    </div>

    <NewCard
      v-if="openModalNewCard"
      @closeModal="closeModalNewCard"
      :favorite="true"
    />
    <ConfirmModal v-if="confirmModal" @closeModal="closeModalConfirmModal" />
    <Loader v-if="showPage" />
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
  name: 'favoriteView',
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
      showPage: true,
    };
  },
  computed: mapGetters([
    'getFavorite',
    'getWeatherForecastFavorite',
    'getWeatherForecastOneDayFavorite',
    'getWeatherForecastFiveDaysFavorite',
    'getArrayWeatherCardFiveDays',
  ]),
  methods: {
    ...mapActions([
      'fetchForecastFavorite',
      'fetchForecastOneDayFavorite',
      'fetchForecastFiveDaysFavorite',
    ]),
    ...mapMutations([
      'pushFavorite',
      'removeFavorite',
      'updateFromLocalStorageFavorite',
      'removeArrayWeatherFavorite',
      'removeArrayWeatherFavoriteChartOneDay',
      'removeArrayWeatherFavoriteChartFiveDays',
      'setError',
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
      if (this.getFavorite.length === 1) {
        this.setError('You cannot remove the last element.');
        return;
      }
      this.confirmModal = true;
    },

    async closeModalConfirmModal(val) {
      this.confirmModal = false;

      if (!val) return;

      this.removeFavorite(this.activeTab);
      let arrForLocalStorage = this.getFavorite.map((e) => e + ';');
      window.localStorage.setItem('favorite', arrForLocalStorage);

      this.checkLocalStorage();
      this.removeArrayWeatherFavorite(this.activeTab);
      this.removeArrayWeatherFavoriteChartOneDay(this.activeTab);
      this.removeArrayWeatherFavoriteChartFiveDays(this.activeTab);

      this.updateArr = !this.updateArr;
      this.activeTab = 0;
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

    async getArrFavorite() {
      await this.getFavorite.forEach((e) => {
        if (this.getWeatherForecastFavorite.some((el) => el.location === e))
          return;

        this.fetchForecastFavorite(e);
        this.fetchForecastOneDayFavorite(e);
        this.fetchForecastFiveDaysFavorite(e);
      });
    },
  },
  async mounted() {
    this.checkLocalStorage();
    await this.getArrFavorite();
    this.showPage = false;
  },
};
</script>

<style scoped>
.favorite {
  margin: 30px auto 0;
  min-height: 100vh;
}

h2 {
  color: #ffffff;
}

.favorite-wrapper {
  position: relative;
  margin-top: 20px;
  padding-top: 40px;
}

.favorite-wrapper .remove,
.favorite-wrapper .favorite {
  display: block;
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  height: 40px;
  opacity: 0.5;
}

.favorite-wrapper .remove:hover {
  opacity: 1;
}

.favorite-wrapper .favorite {
  right: auto;
  margin: 0;
  left: 0;
  opacity: 1;
  cursor: auto;
}

.favorite-wrapper .remove img,
.favorite-wrapper .favorite img {
  display: block;
  width: 40px;
  height: 40px;
}

.favorite-top {
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
