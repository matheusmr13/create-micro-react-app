export default {
	initialize(Api) {
		return new Promise((resolve) => {
			setInterval(() => {
				Api.api.setCurrentTime(new Date());
			}, 1000);
	
			setTimeout(() => {
				resolve();
			}, 4000);
		});
	},
	interface: {
		currentTime: {
			initialState: new Date()
		}
	}
};

