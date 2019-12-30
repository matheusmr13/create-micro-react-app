import { CreateLib } from 'react-microfrontend';
import schema from './schema';
import Cart from '../Cart';

const api = CreateLib(schema, { apiAccess: CreateLib.BUILD_TYPE.PRIVATE_API, packageName: "@market/cart" });

api.onInitialize(() => {
  console.info('onItilizaize');

  let onCartChange = (cart) => console.info('alteroooou', cart);

  api.setCart(new Cart());
  api.onAddProductToCardCalled((product) => {
    const cart = new Cart();
    cart.products = [...(api.getCart().products), product];
    api.setCart(cart);
  });
  api.onCartChange((cart) => (onCartChange || (() => {}))(cart));

})

export default api;
