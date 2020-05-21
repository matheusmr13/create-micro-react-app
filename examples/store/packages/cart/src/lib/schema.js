import { Api } from 'react-microfrontend';
export default {
  name: 'cart',
  interface: {
    cart: {
      initialState: {
        products: [],
      },
    },
    addProductToCart: {
      type: Api.TYPE.FUNCTION,
    },
    removeProductFromCart: {
      type: Api.TYPE.FUNCTION,
    },
  },
};
