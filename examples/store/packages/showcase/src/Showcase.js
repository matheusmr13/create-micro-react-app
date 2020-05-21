import React from 'react';
import './Showcase.css';

import ShowcaseApi from './lib';
import CartApi from 'cart';
import './Showcase.css';

const products = require('./products.json');

const Product = ({ product, onBuy, onDetails }) => (
  <div className="Product">
    <div className="Product__image">
      <img src={product.image.small} />
    </div>
    <div className="Product__name">{product.name}</div>
    <div className="Product__rating">Rating: {product.rating && product.rating.toFixed(2).replace('.', ',')}</div>
    <div className="Product__price">R$ {product.price.toFixed(2).replace('.', ',')}</div>
    <div className="Product__actions">
      <button className="Button" onClick={() => onBuy(onBuy)}>
        Comprar
      </button>
    </div>
  </div>
);

const Showcase = ({ filterBy }) => {
  const { tag } = filterBy;
  return (
    <div className="Showcase">
      <div className="Showcase__filter">
        <button onClick={() => ShowcaseApi.setFilterBy({})}>Clear filters</button>
      </div>
      <div className="Showcase__products">
        {Object.values(products)
          .filter((product) => product.tag === tag)
          .map((product) => (
            <Product
              key={product.id}
              product={product}
              onBuy={() => CartApi.callAddProductToCart(product)}
              // onDetails={() => history.push(`/product/${product.id}`)}
            />
          ))}
      </div>
    </div>
  );
};
export default ShowcaseApi.withFilterBy(Showcase);
