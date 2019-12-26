import {
	createActions,
	handleActions
} from 'redux-actions';
import {
	Shared
} from 'react-microfrontend';


const shared = new Shared('__state__');
const calculator = new Shared('calculator');

const initialState = {
	value: 0
};

export const Actions = createActions({
	CHANGE_VALUE: value => value,

	RESET_VALUE: () => {},
}, {
	prefix: 'calculator'
});

const stateToProps = {
	onResetValue: null,
	onChangeValue: null,
	changeValue: value => shared.get('dispatch')(Actions.changeValue(value)),
	resetValue: value => shared.get('dispatch')((dispatch, getState) => {
		dispatch(Actions.resetValue(value));
		return Promise.resolve();
	})
}

const reducer = handleActions({
	[Actions.resetValue]: (state) => {
		const newState = {
			...state,
			value: 0
		}
		API.onResetValue && API.onResetValue();

		return newState;
	},
	[Actions.changeValue]: (state, {
		payload: value
	}) => {

		const newState = {
			...state,
			value
		}

		const callback = calculator.get('onChangeValue')
		callback && callback(value);

		return newState;
	}
}, initialState);

export const API = stateToProps;

export default reducer;