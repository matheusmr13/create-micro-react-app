import { API } from './new-lib';
import {
	Shared
} from 'react-microfrontend';

const shared = new Shared('calculator');

export default ({
	resetValue: API.resetValue,
	onChangeValue: (callback) => {
		shared.set('onChangeValue', callback);
	},
});