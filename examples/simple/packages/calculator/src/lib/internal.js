import { CALCULATOR_SHARED, VALUE, ON_RESET_VALUE } from './shared-constants';

import { Shared } from 'react-microfrontend';

const shared = new Shared(CALCULATOR_SHARED);

class CalculatorDispatch {
	static changeValue(newValue) {
		shared.get(VALUE)(newValue);
		console.info(shared);
	}

	static onResetValue(callback) {
		shared.set(ON_RESET_VALUE, callback);
	}
}

export default CalculatorDispatch;