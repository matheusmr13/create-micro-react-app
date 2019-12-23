import React from 'react';
import logo from './logo.svg';
import './App.css';
import CartApi from './index-lib';

class App extends React.Component {
  state = {
    cart: null,
  }

  componentDidMount() {
    console.info(CartApi.cart);
    this.setState({
      cart: CartApi.cart
    });

    // CartApi.cart.subscribe((cart) => {
    //   this.setState({
    //     cart: CartApi.cart
    //   });
    // });
  }
  render() {
    if (!CartApi.cart) return null
    return (
      <div className="Widget">
        Itens adicionados: {CartApi.cart.items.length}
      </div>
    );
  }
}

export default App;
