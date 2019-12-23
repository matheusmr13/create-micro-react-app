import { CALCULATOR_SHARED, VALUE, ON_RESET_VALUE } from './shared-constants';

import { Shared, Observable } from 'react-microfrontend';

const calculatorObservable = new Observable(CALCULATOR_SHARED);
const resetObservable = new Observable(ON_RESET_VALUE);

class CalculatorObservable {
	static subscribeToValue(subscribe) {
		calculatorObservable.subscribe(subscribe);
	}

	static resetValue() {
		resetObservable.dispatch(ON_RESET_VALUE);
	}
}

export default CalculatorObservable;