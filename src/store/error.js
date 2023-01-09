export default {
	state: {
		error: "",
	},
	mutations: {
		setError(state, error) {
			const body = document.body.classList;
			body.add('lock');

			state.error = error;

			setTimeout(() => {
				state.error = "";
				const body = document.body.classList;
				body.remove('lock');
			}, 3000)
		},
	},
	getters: {
		getError(state) {
			return state.error;
		},
	}
}