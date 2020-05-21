import React from 'react';
import CartApi from './lib';
import CartSvg from './cart.svg';

import './CartWidget.css';

function CartWidget({ cart, onClick }) {
  const { products } = cart;
  return (
    <div className="CartWidget" onClick={onClick} role="button" tabIndex={-1}>
      <img src={CartSvg} className="CartWidget__icon" />
      <div className="CartWidget__text">
        Cart
        {products.length > 0 && <div className="CartWidget__badge">{products.length}</div>}
      </div>
    </div>
  );
}

export default CartApi.withCart(CartWidget);
