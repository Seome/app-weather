export default {
	state: {
		userInfo: {},
		switchScheme: true
	},
	mutations: {
		setInfoUser(state, userInfo) {
			state.userInfo = userInfo;
		},
		changeColorScheme(state) {
			state.switchScheme = !state.switchScheme;
		},
	},
	actions: {
		async fetchInfoUser({ commit }) {
			try {
				const res = await fetch(`https://ipinfo.io/json?token=${process.env.VUE_APP_IPINFO_TOKEN}`)
				const data = await res.json();
				commit('setInfoUser', data);
			} catch (e) {
				throw e;
			}
		},
	},
	getters: {
		getUserInfo(state) {
			return state.userInfo;
		},
		getColorScheme(state) {
			return state.switchScheme;
		}
	}
}