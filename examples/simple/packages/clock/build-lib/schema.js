export default {
	initialize(api) {
		setInterval(() => {
			api.setCurrentTime(new Date());
		}, 1000);
	},
	interface: {
		currentTime: {
			initialState: new Date()
		}
	}
};

