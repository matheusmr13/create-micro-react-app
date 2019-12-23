import { CALCULATOR_SHARED, VALUE, ON_RESET_VALUE } from './shared-constants';

import { Shared, Observable } from 'react-microfrontend';
const calculatorObservable = new Observable(CALCULATOR_SHARED);
const resetObservable = new Observable(ON_RESET_VALUE);

class CalculatorDispatch {

	static changeValue(newValue) {
		calculatorObservable.dispatch(newValue);
	}

	static onResetValue(callback) {
		resetObservable.subscribe(callback);
	}
}

export default CalculatorDispatch;