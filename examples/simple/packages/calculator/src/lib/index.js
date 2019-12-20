import { CALCULATOR_SHARED, VALUE, ON_RESET_VALUE } from './shared-constants';

import { Shared } from 'react-microfrontend';

const shared = new Shared(CALCULATOR_SHARED);

class CalculatorClient {
	static subscribeToValue(subscribe) {
		shared.set(VALUE, subscribe);
	}

	static resetValue() {
		shared.get(ON_RESET_VALUE)();
	}
}

export default CalculatorClient;