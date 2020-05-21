import React from 'react';
import CartApi from './lib';

import './CartScreen.css';

const CartItem = ({ product }) => (
  <div className="CartItem">
    <img src={product.image.small} className="CartItem__image" />
    <div className="CartItem__name">{product.name}</div>
    <div className="CartItem__rating">Rating: {product.rating && product.rating.toFixed(2).replace('.', ',')}</div>
    <div className="CartItem__price">R$ {product.price.toFixed(2).replace('.', ',')}</div>
    <div className="CartItem__quantity">Qtty: {product.qtty}</div>
    <div className="CartItem__actions">
      <button className="Button" onClick={() => CartApi.callRemoveProductFromCart(product)}>
        Remove
      </button>
    </div>
  </div>
);

function CartScreen({ cart, onBack }) {
  const { products } = cart;
  return (
    <div className="CartScreen">
      <div className="CartScreen__title">
        <button onClick={onBack}>Voltar</button>
        <h2>Cart</h2>
      </div>
      <div className="CartScreen__items">
        {Object.values(
          products.reduce((agg, product) => {
            return Object.assign(agg, {
              [product.id]: {
                ...product,
                qtty: ((agg[product.id] || {}).qtty || 0) + 1,
              },
            });
          }, {})
        ).map((product) => (
          <CartItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default CartApi.withCart(CartScreen);
