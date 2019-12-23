function observable() {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        return 'a';
    }
}

// market


// cart

	class CartItem {
		product: Product
		quantity: number
	}

	class Cart {
		itens: Array<CartItem>
	}


	class CartApi {

		@observable()
		cart(): Cart

		@action 
		addProduct // Store and ItemDetails micro call to add a product to cart

		@action
		changeCartItemQuantity(item, quantity) {
			sitem.quantity = 
		}
	}

// item details

	class ItemDetailsApi {
		handle
	}

	// Does ItemDetails need to subscribe to cart change?
	CartApi.subscribeToCart((cart) => {
	});

	//...
	handleAddItemClick() {
		CartApi.addItem(this.props.currentItem);
	}

// store

	class Product {
		name: string
		price: number
	}


	class StoreApi {

	}