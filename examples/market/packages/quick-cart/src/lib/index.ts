import { CreateLib } from 'react-microfrontend';
import schema from './schema';
import CartApi from '@market/cart';

const api = CreateLib(schema, { apiAccess: CreateLib.BUILD_TYPE.PRIVATE_API, packageName: "market_quick-cart" });

api.onInitialize(() => {
  api.onRemoveProductFromCartCalled((product) => CartApi.callRemoveProductFromCart(product));
})

export default api;
