import React from 'react';
import './Widget.css';
import CartApi from 'lib';
import Cart from 'models/Cart';

class Widget extends React.Component<{
  cart: Cart
}> {
  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState({
  //       cart: CartApi.getCart()
  //     });
  //   }, 2000);
  //   // onCartChange = (cart) => {
  //   //   this.setState({
  //   //     cart
  //   //   });
  //   // };
  // }

  render() {
    const { cart } = this.props;

    if (!cart) return null
    return (
      <div className="Widget">
        Itens adicionados: {cart.products.length}
      </div>
    );
  }
}

export default CartApi.withCart(Widget);
