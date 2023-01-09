export default {
	state: {
		weatherForecast: {},
		weatherForecastFiveDays: {},
		weatherInput: "",
		weatherForecastOneDay: {},
		arrayWeatherHome: [],
		arrayWeatherHomeChartOneDay: [],
		arrayWeatherHomeChartFiveDays: [],
		arrayWeatherCardFiveDaysHome: []
	},
	mutations: {
		setAutocomplete(state, userInfo) {
			state.userInfo = userInfo;
		},
		setWeatherInput(state, val) {
			state.weatherInput = val;
		},
		setWeatherForecast(state, weatherForecast) {

			let parsData = {
				cloudiness: weatherForecast.clouds.all,
				windSpeed: weatherForecast.wind.speed,
				humidity: weatherForecast.main.humidity,
				temperatureValue: Math.round(weatherForecast.main.temp),
				temperatureHigh: Math.round(weatherForecast.main.temp_max),
				temperatureLow: Math.round(weatherForecast.main.temp_min),
				location: weatherForecast.name + ", " + weatherForecast.sys.country,
				description: weatherForecast.weather[0].description,
				date: weatherForecast.dt,
				timezone: weatherForecast.timezone
			}

			state.weatherForecast = parsData;
		},
		setWeatherForecastFiveDays(state, data) {
			state.weatherForecastFiveDays = data;
		},
		setWeatherForecastOneDay(state, data) {
			state.weatherForecastOneDay = data;
		},
		pushArrayWeatherHome(state, data) {
			state.arrayWeatherHome.push(data);
		},
		pushArrayWeatherHomeChartOneDay(state, data) {
			state.arrayWeatherHomeChartOneDay.push(data);
		},
		pushArrayWeatherHomeChartFiveDays(state, data) {
			state.arrayWeatherHomeChartFiveDays.push(data);
		},
		updateArrayWeatherHome(state, data) {
			state.arrayWeatherHome[data.index] = data.data;
		},
		updateArrayWeatherHomeChartOneDay(state, data) {
			state.arrayWeatherHomeChartOneDay[data.index] = data.data;
		},
		updateArrayWeatherHomeChartFiveDays(state, data) {
			state.arrayWeatherHomeChartFiveDays[data.index] = data.data;
		},
		removeArrayWeatherHome(state, index) {
			state.arrayWeatherHome.splice(index, 1);
		},
		removeArrayWeatherHomeChartOneDay(state, index) {
			state.arrayWeatherHomeChartOneDay.splice(index, 1);
		},
		removeArrayWeatherHomeChartFiveDays(state, index) {
			state.arrayWeatherHomeChartFiveDays.splice(index, 1);
		},

		setArrayWeatherCardFiveDaysHome(state, res) {

			let map = [];
			for (let val of res.list) {
				if (map.length == 5) {
					break;
				}

				let data = new Date(val.dt * 1000).toLocaleDateString(undefined, {
					month: 'short',
					day: 'numeric',
				});

				if (!map.some(e => e.date == data)) {
					map.push({
						date: data,
						temperatureValue: Math.round(val.main.temp),
						temperatureHigh: Math.round(val.main.temp_max),
						temperatureLow: Math.round(val.main.temp_min),

						cloudiness: val.clouds.all,
						windSpeed: val.wind.speed,
						humidity: val.main.humidity,

						location: res.city.name + ", " + res.city.country,
						description: val.weather[0].description,
					})
				}
			}

			state.arrayWeatherCardFiveDaysHome.push(map);
		},
	},
	actions: {
		async fetchForecast(context, strAddress) {
			const appId = process.env.VUE_APP_WEATHER_API_KEY;
			try {
				const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${strAddress}&appid=${appId}&units=metric`);
				const data = await res.json();
				context.commit('setWeatherForecast', data);
			} catch (e) {
				context.commit('setError', "City not found");
				throw e;
			}
		},

		async fetchForecastOneDay(context, strAddress) {
			const appId = process.env.VUE_APP_WEATHER_API_KEY;
			try {
				const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${strAddress}&cnt=9&appid=${appId}&units=metric`);
				const data = await res.json();

				context.commit('setWeatherForecastOneDay', data);
			} catch (e) {
				throw e;
			}
		},

		async fetchForecastFiveDays(context, strAddress) {
			const appId = process.env.VUE_APP_WEATHER_API_KEY;
			try {
				const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${strAddress}&appid=${appId}&units=metric`);
				const data = await res.json();

				context.commit('setWeatherForecastFiveDays', data);
				context.commit('setArrayWeatherCardFiveDaysHome', data);
			} catch (e) {
				throw e;
			}
		},
	},
	getters: {
		getAutocomplete(state) {
			return state.userInfo;
		},
		getWeatherInput(state) {
			return state.weatherInput;
		},
		getWeatherForecast(state) {
			return state.weatherForecast;
		},
		getWeatherForecastFiveDays(state) {
			return state.weatherForecastFiveDays;
		},
		getWeatherForecastOneDay(state) {
			return state.weatherForecastOneDay;
		},
		getArrayWeatherHome(state) {
			return state.arrayWeatherHome;
		},
		getArrayWeatherHomeChartOneDay(state) {
			return state.arrayWeatherHomeChartOneDay;
		},
		getArrayWeatherHomeChartFiveDays(state) {
			return state.arrayWeatherHomeChartFiveDays;
		},
		getArrayWeatherCardFiveDaysHome(state) {
			return state.arrayWeatherCardFiveDaysHome;
		}
	}
}