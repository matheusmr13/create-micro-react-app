import React from 'react';
import './Widget.css';
import CartApi from './lib';
import Cart from './Cart';

class Widget extends React.Component {
  state = {
    cart: null,
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        cart: CartApi.getCart()
      });
    }, 2000);
    // onCartChange = (cart) => {
    //   this.setState({
    //     cart
    //   });
    // };
  }

  render() {
    const { cart } = this.state;
    if (!cart) return null
    return (
      <div className="Widget">
        Itens adicionados: {cart.products.length}
      </div>
    );
  }
}

export default Widget;
