import { CreateLib } from 'react-microfrontend';

export const api = {
	properties: {
		value: {
			initialState: 0
		},
		resetValue: {
			access: CreateLib.ACCESS.PUBLIC,
			type: CreateLib.TYPE.TRIGGER
		},
		sumFiveToCounter: {
			access: CreateLib.ACCESS.PUBLIC,
			type: CreateLib.TYPE.TRIGGER
		}
	}
};

export default CreateLib(api, CreateLib.BUILD_TYPE.PUBLIC_API);