<template>
  <div class="text-field">
    <label class="text-field__label" for="search">Search</label>
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
        Search
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
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'Input',
  props: {
    activeTab: Number,
  },
  data: () => ({
    location: '',
    searchResults: [],
    service: null,
    showAutocomplete: false,
    oldLocation: '',
  }),
  computed: mapGetters([
    'getWeatherForecast',
    'getArrayWeatherHome',
    'getWeatherForecastOneDay',
    'getWeatherForecastFiveDays',
    'getError',
  ]),
  methods: {
    ...mapActions([
      'fetchForecast',
      'fetchForecastFiveDays',
      'fetchForecastOneDay',
    ]),
    ...mapMutations([
      'updateArrayWeatherHome',
      'updateArrayWeatherHomeChartOneDay',
      'updateArrayWeatherHomeChartFiveDays',
      'setError',
    ]),
    search() {
      this.showAutocomplete = false;
      if (!this.location) return;
      this.pushStore();
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
      this.pushStore();
    },
    async pushStore() {
      this.loader = true;
      let convertVal = this.location
        .split(',')
        .map((e) => e.trim())
        .join();

      await this.fetchForecast(convertVal);
      await this.fetchForecastFiveDays(convertVal);
      await this.fetchForecastOneDay(convertVal);

      this.loader = false;

      if (
        this.getArrayWeatherHome.some(
          (e) => e.location === this.getWeatherForecast.location
        )
      ) {
        this.setError('This city is already on your list.');
        return;
      }

      this.updateArrayWeatherHome({
        data: this.getWeatherForecast,
        index: this.activeTab,
      });
      this.updateArrayWeatherHomeChartOneDay({
        data: this.getWeatherForecastOneDay,
        index: this.activeTab,
      });
      this.updateArrayWeatherHomeChartFiveDays({
        data: this.getWeatherForecastFiveDays,
        index: this.activeTab,
      });

      this.$emit('updateArr');

      this.location = '';
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
.text-field {
  max-width: 420px;
  margin-bottom: 10px;
}

.text-field__label {
  display: block;
  margin-bottom: 10px;
  text-align: left;
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
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
  border: 0px solid #bdbdbd;
  border-radius: 5px;
  background-color: #2196f3;
  color: #ffffff;
  font-weight: bold;
  vertical-align: middle;
  text-align: center;
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
  text-align: left;
  cursor: pointer;
  background: #ffffff;
  z-index: 10;
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
</style>
