import { CreateLib } from 'react-microfrontend';

export default {
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

