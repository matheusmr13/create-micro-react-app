import React from 'react';
import './QuickCart.css';

import QuickCartApi from './lib';
import CartApi from '@market/cart';

class QuickCart extends React.Component<{ cart: any }> {
  render() {
    const { cart } = this.props;

    if (!cart) return null;

    return (
      <div className="QuickCart">
        { cart.products.map((product, index) => (
          <div className="QuickCart__product" key={index}>
            {product.name}
            <div
              className="QuickCart__remove"
              onClick={() => QuickCartApi.callRemoveProductFromCart(product)}
            >Remover</div>
          </div>
        )) }
      </div>
    );
  }
}

export default CartApi.withCart(QuickCart);
