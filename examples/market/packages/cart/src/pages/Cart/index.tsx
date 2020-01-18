import React from 'react';
import CartApi from 'lib';
import Cart from 'models/Cart';
import CartItem from './item';

// import './App.css';
class CartView extends React.Component<{
  cart: Cart
}> {
  render() {
    const { cart } = this.props;

    return (
      <div className="CartView">
        { cart.products.map((product, i) => (
          <CartItem product={product} key={i} />
        ))}
      </div>
    );
  }
}

export default CartApi.withCart(CartView);
