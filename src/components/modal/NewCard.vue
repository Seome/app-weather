<template>
  <div class="new-card">
    <a href="#" class="close" @click="closeModal"></a>
    <div class="text-field">
      <label class="text-field__label" for="search">Add block</label>
      <div class="text-field__group">
        <input
          class="text-field__input"
          type="search"
          id="search"
          name="search"
          v-model="location"
          @keyup.enter="search"
        />
        <button class="text-field__btn" type="button" @click="search">
          Add block
        </button>
        <ul class="text-field__autocomplete" v-show="showAutocomplete">
          <li
            v-for="(result, i) in searchResults"
            :key="i"
            @click="autocomplete(result)"
          >
            {{ result }}
          </li>
        </ul>
      </div>
    </div>
    <Loader v-if="loader" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import Loader from '@/components/Loader.vue';

export default {
  name: 'Input',
  components: {
    Loader,
  },
  props: {
    favorite: Boolean,
  },
  data: () => ({
    location: '',
    searchResults: [],
    service: null,
    showAutocomplete: false,
    oldLocation: '',
    loader: false,
  }),
  computed: mapGetters([
    'getWeatherForecast',
    'getArrayWeatherHome',
    'getWeatherForecastOneDay',
    'getWeatherForecastFiveDays',
    'getError',
    'getFavorite',
    'getWeatherForecastFavorite',
    'getNewFavoriteName',
  ]),
  methods: {
    ...mapActions([
      'fetchForecast',
      'fetchForecastFiveDays',
      'fetchForecastOneDay',
      'fetchForecastFavorite',
      'fetchForecastOneDayFavorite',
      'fetchForecastFiveDaysFavorite',
      'fetchForecastFavoriteNewName',
    ]),
    ...mapMutations([
      'pushArrayWeatherHome',
      'pushArrayWeatherHomeChartOneDay',
      'pushArrayWeatherHomeChartOneDay',
      'pushArrayWeatherHomeChartFiveDays',
      'setError',
      'removeFavorite',
      'pushFavorite',
    ]),
    search() {
      this.showAutocomplete = false;
      if (!this.favorite) this.pushStore();
      else this.pushNewFavorite();
    },
    MapsInit() {
      this.service = new window.google.maps.places.AutocompleteService();
    },
    displaySuggestions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      this.searchResults = predictions.map((prediction) => {
        return prediction.description;
      });
      this.showAutocomplete = true;
    },
    autocomplete(val) {
      this.location = val;
      this.searchResults = [];
      this.showAutocomplete = false;
      this.oldLocation = val;
      if (!this.favorite) this.pushStore();
      else this.pushNewFavorite();
    },
    async pushStore() {
      let convertVal = this.location
        .split(',')
        .map((e) => e.trim())
        .join();
      await this.fetchForecast(convertVal);

      if (
        this.getArrayWeatherHome.some(
          (e) => e.location === this.getWeatherForecast.location
        )
      ) {
        this.setError('This city is already on your list.');
        this.closeModal();
        return;
      } else if (this.getArrayWeatherHome.length >= 5) {
        this.setError('Only 5 blocks can be added.');
        this.closeModal();
        return;
      }

      await this.fetchForecastOneDay(convertVal);
      await this.fetchForecastFiveDays(convertVal);

      this.pushArrayWeatherHome(this.getWeatherForecast);
      this.pushArrayWeatherHomeChartOneDay(this.getWeatherForecastOneDay);
      this.pushArrayWeatherHomeChartFiveDays(this.getWeatherForecastFiveDays);
      this.closeModal();
    },

    async pushNewFavorite() {
      let convertVal = this.location
        .split(',')
        .map((e) => e.trim())
        .join();

      await this.fetchForecastFavoriteNewName(convertVal);

      if (this.getFavorite.some((e) => e === this.getNewFavoriteName)) {
        this.setError('This city is already on your list.');
        this.closeModal();
        return;
      } else if (this.getFavorite.length >= 5) {
        this.setError('Only 5 blocks can be added.');
        this.closeModal();
        return;
      }

      await this.fetchForecastFavorite(this.getNewFavoriteName);
      await this.fetchForecastOneDayFavorite(this.getNewFavoriteName);
      await this.fetchForecastFiveDaysFavorite(this.getNewFavoriteName);

      this.pushFavorite(this.getNewFavoriteName);

      let arrForLocalStorage = this.getFavorite.map((e) => e + ';');
      window.localStorage.setItem('favorite', arrForLocalStorage);

      this.closeModal();
    },

    closeModal() {
      this.$emit('closeModal');
    },
  },
  watch: {
    location(newValue) {
      if (!newValue || newValue === this.oldLocation) {
        this.showAutocomplete = false;
        this.oldLocation = '';
      } else if (newValue) {
        this.service.getPlacePredictions(
          {
            input: this.location,
            types: ['(cities)'],
          },
          this.displaySuggestions
        );
      }
    },
  },
  mounted() {
    this.MapsInit();
  },
};
</script>

<style scoped>
.new-card {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #212529;
}

.text-field {
  position: relative;
  top: 50%;
  left: 50%;
  max-width: 420px;
  transform: translate(-50%, -50%);
}

.text-field__label {
  display: block;
  margin-bottom: 10px;
  color: #ffffff;
  text-align: left;
  font-weight: bold;
  font-size: 20px;
}

.text-field__input {
  display: block;
  width: 100%;
  height: 38px;
  padding: 6px 12px;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  background-color: #ffffff;
  background-clip: padding-box;
  color: #212529;
  font-family: inherit;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.text-field__input[type='search']::-webkit-search-decoration,
.text-field__input[type='search']::-webkit-search-cancel-button,
.text-field__input[type='search']::-webkit-search-results-button,
.text-field__input[type='search']::-webkit-search-results-decoration {
  -webkit-appearance: none;
}

.text-field__input::placeholder {
  color: #212529;
  opacity: 0.4;
}

.text-field__input:focus {
  outline: 0;
  border-color: #bdbdbd;
  background-color: #ffffff;

  /* box-shadow: 0 0 0 3px rgba(158, 158, 158, 0.25); */
  color: #212529;
}

.text-field__input:disabled,
.text-field__input[readonly] {
  background-color: #f5f5f5;
  opacity: 1;
}

.text-field__group {
  position: relative;
  display: flex;
}

.text-field__btn {
  display: inline-block;
  padding: 6px 12px;
  border: 0 solid #bdbdbd;
  border-radius: 5px;
  background-color: #2196f3;
  color: #ffffff;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;
  font-weight: bold;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  user-select: none;

  -webkit-user-select: none;
  -moz-user-select: none;
}

.text-field__autocomplete {
  position: absolute;
  top: 35px;
  left: 0;
  max-width: 420px;
  margin: 5px 71px 0 0;
  padding: 15px 0;
  list-style: none;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
}

.text-field__autocomplete li {
  padding: 5px 12px;
}

.text-field__autocomplete li:hover {
  background-color: #f5f2f2;
}

.text-field__btn:hover {
  background-color: #504860;
}

.text-field__group input {
  position: relative;
  z-index: 2;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.text-field__btn {
  position: relative;
  border-left-width: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.close {
  position: absolute;
  top: 32px;
  right: 32px;
  width: 32px;
  height: 32px;
  opacity: 0.8;
}

.close:hover {
  opacity: 1;
}

.close:before,
.close:after {
  content: ' ';
  position: absolute;
  left: 15px;
  width: 2px;
  height: 33px;
  background-color: #ffffff;
}

.close:before {
  transform: rotate(45deg);
}

.close:after {
  transform: rotate(-45deg);
}
</style>
