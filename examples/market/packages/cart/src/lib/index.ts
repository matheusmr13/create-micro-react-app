import { CreateLib } from 'react-microfrontend';
import schema from './schema';
import Cart from 'models/Cart';

const api = CreateLib(schema, { apiAccess: CreateLib.BUILD_TYPE.PRIVATE_API, packageName: "market_cart" });

api.onInitialize(() => {
  api.setCart(new Cart());
  api.onAddProductToCardCalled((product) => {
    const cart = new Cart();
    cart.products = [...(api.getCart().products), product];
    api.setCart(cart);
  });
})

export default api;
