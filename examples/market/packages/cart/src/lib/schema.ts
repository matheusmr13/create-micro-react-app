import { CreateLib } from 'react-microfrontend';

export default {
	interface: {
		cart: {
			initialState: null
    },
    addProductToCart: {
      type: CreateLib.TYPE.FUNCTION
    },
    removeProductFromCart: {
      type: CreateLib.TYPE.FUNCTION
    }
	}
};

