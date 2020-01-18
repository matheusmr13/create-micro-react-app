import React from 'react';
// import './App.css';

const CartItem = ({ product }) => {
  return (
    <div className="CartItem">
      {product.name}
      {product.price}
    </div>
  );
}

export default CartItem;
