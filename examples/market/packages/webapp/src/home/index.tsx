import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { withMicrofrontend } from 'react-microfrontend';
import './product.css';

import CartApi from '@market/cart';

interface Product {
	id: string,
	name: string,
	rating: number,
	price: number,
	image: {
		small: string,
		medium: string,
	}
};

const products: Array<Product> = require('./products.json');

const handleButtonClick = (callback ?: Function) => () => {
	callback && callback();
}

const Product: React.FC<{
	product: any,
	onBuy ?: Function,
	onDetails ?: Function
}> = ({ product, onBuy, onDetails }) => (
	<div className="Product">
		<div className="Product__image">
			<img src={product.image.small} />
		</div>
		<div className="Product__name">
			{product.name}
		</div>
		<div className="Product__rating">
			Rating: {product.rating && product.rating.toFixed(2).replace('.', ',')}
		</div>
		<div className="Product__price">
			R$ {product.price.toFixed(2).replace('.', ',')}
		</div>
		<div className="Product__actions">
			<button className="Button" onClick={handleButtonClick(onDetails)}>Detalhes</button>
			<button className="Button" onClick={handleButtonClick(onBuy)}>Comprar</button>
		</div>
	</div>
)

const Home: React.FC<RouteComponentProps> = ({ history, microfrontend }) => {
  return (
    <div className="Home">
		{Object.values(products).map(( product :Product) => (
			<Product
				key={product.id}
				product={product}
				onBuy={() => { console.info('clicou'); CartApi.callAddProductToCard(product) }}
				onDetails={() => history.push(`/product/${product.id}`)}
			/>
		))}
    </div>
  );
}

export default withMicrofrontend(withRouter(Home), { microfrontendKey: CartApi.get() });
