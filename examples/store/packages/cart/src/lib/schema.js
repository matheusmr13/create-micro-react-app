import { Api } from 'react-microfrontend';
export default {
  name: 'cart',
  interface: {
    cart: {
      initialValue: {
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
