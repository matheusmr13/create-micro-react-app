import { CreateLib } from 'react-microfrontend';

export default {
	prepare() {
		console.info('should set listeners here');
	},
	initialize() {
		console.info('should initialize what will be executed. Will be mostly used for "only lib" microfrontend.');
	},
	interface: {
		value: {
			initialState: 0
		},
		resetValue: {
			access: CreateLib.ACCESS.PUBLIC,
			type: CreateLib.TYPE.TRIGGER
		},
		scheduleResetValue: {
			type: CreateLib.TYPE.FUNCTION
		}
	}
};

