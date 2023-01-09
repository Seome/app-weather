export default {
	state: {
		favorite: [],
		newFavoriteName: "",
		weatherForecastFavorite: [],
		weatherForecastOneDayFavorite: [],
		weatherForecastFiveDaysFavorite: [],
		arrayWeatherCardFiveDays: []
	},
	mutations: {
		pushFavorite(state, favorite) {
			state.favorite.push(favorite);
		},
		removeFavorite(state, index) {
			state.favorite.splice(index, 1);
		},
		updateFromLocalStorageFavorite(state, arr) {
			state.favorite = arr;
		},
		setWeatherForecastFavorite(state, weatherForecast) {
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

			state.weatherForecastFavorite.push(parsData);
		},
		setNewFavoriteName(state, weatherForecast) {
			state.newFavoriteName = weatherForecast.name + ", " + weatherForecast.sys.country
		},
		setWeatherForecastOneDayFavorite(state, data) {
			state.weatherForecastOneDayFavorite.push(data);
		},
		setWeatherForecastFiveDaysFavorite(state, data) {
			state.weatherForecastFiveDaysFavorite.push(data);
		},

		removeArrayWeatherFavorite(state, index) {
			state.weatherForecastFavorite.splice(index, 1);
		},
		removeArrayWeatherFavoriteChartOneDay(state, index) {
			state.weatherForecastOneDayFavorite.splice(index, 1);
		},
		removeArrayWeatherFavoriteChartFiveDays(state, index) {
			state.weatherForecastFiveDaysFavorite.splice(index, 1);
		},

		setArrayWeatherCardFiveDays(state, res) {

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

			state.arrayWeatherCardFiveDays.push(map);
		},

	},
	actions: {
		async fetchForecastFavorite(context, strAddress) {
			const appId = process.env.VUE_APP_WEATHER_API_KEY;
			try {
				const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${strAddress}&appid=${appId}&units=metric`);
				const data = await res.json();

				if (data.cod === 404) {
					setError(data.message)
					return;
				}
				context.commit('setWeatherForecastFavorite', data);
			} catch (e) {
				throw e;
			}
		},
		async fetchForecastFavoriteNewName(context, strAddress) {
			const appId = process.env.VUE_APP_WEATHER_API_KEY;
			try {
				const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${strAddress}&appid=${appId}&units=metric`);
				const data = await res.json();
				context.commit('setNewFavoriteName', data);
			} catch (e) {
				context.commit('setError', "City not found");
				throw e;
			}
		},
		async fetchForecastOneDayFavorite(context, strAddress) {
			const appId = process.env.VUE_APP_WEATHER_API_KEY;
			try {
				const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${strAddress}&cnt=9&appid=${appId}&units=metric`);
				const data = await res.json();

				context.commit('setWeatherForecastOneDayFavorite', data);
			} catch (e) {
				throw e;
			}
		},

		async fetchForecastFiveDaysFavorite(context, strAddress) {
			const appId = process.env.VUE_APP_WEATHER_API_KEY;
			try {
				const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${strAddress}&appid=${appId}&units=metric`);
				const data = await res.json();

				context.commit('setWeatherForecastFiveDaysFavorite', data);
				context.commit('setArrayWeatherCardFiveDays', data);
			} catch (e) {
				throw e;
			}
		},
	},
	getters: {
		getFavorite(state) {
			return state.favorite;
		},
		getWeatherForecastFavorite(state) {
			return state.weatherForecastFavorite;
		},
		getWeatherForecastOneDayFavorite(state) {
			return state.weatherForecastOneDayFavorite;
		},
		getWeatherForecastFiveDaysFavorite(state) {
			return state.weatherForecastFiveDaysFavorite;
		},
		getNewFavoriteName(state) {
			return state.newFavoriteName;
		},
		getArrayWeatherCardFiveDays(state) {
			return state.arrayWeatherCardFiveDays;
		}
	}
}