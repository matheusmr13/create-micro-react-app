import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom'; 
import './product.css';

import CartApia from '@market/cart';

console.info('-----------------------')
console.info(CartApia)

const a = new CartApia();
console.info(a.hue)
a.hue = 'hahahaha'

console.info(a.hue)

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

const Home: React.FC<RouteComponentProps> = ({ history }) => {

	const CartApi = {addProductToCard: (a) => {}};
  return (
    <div className="Home">
		{Object.values(products).map(( product :Product) => (
			<Product
				key={product.id}
				product={product}
				onBuy={() => CartApi.addProductToCard(product)}
				onDetails={() => history.push(`/product/${product.id}`)}
			/>
		))}
    </div>
  );
}

export default withRouter(Home);
