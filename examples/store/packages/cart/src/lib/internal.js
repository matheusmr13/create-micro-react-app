import schema from './schema';
import { Api } from 'react-microfrontend';
const api = new Api(schema).build();

api.onAddProductToCartCalled((product) => {
  api.setCart(
    Object.assign({
      products: [...api.getCart().products, product],
    })
  );
});

api.onRemoveProductFromCartCalled((productToRemove) => {
  api.setCart(
    Object.assign({
      products: api.getCart().products.filter((product) => product.id !== productToRemove.id),
    })
  );
});

export default schema;
