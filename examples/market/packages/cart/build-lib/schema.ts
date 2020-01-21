import { CreateLib } from 'react-microfrontend';

export default {
	interface: {
		cart: {
			initialState: null
    },
    addProductToCard: {
      type: CreateLib.TYPE.FUNCTION
    }
	}
};

