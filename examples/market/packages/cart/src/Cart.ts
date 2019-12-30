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

class Cart {
	products: Array<Product> = []
}

export default Cart;
