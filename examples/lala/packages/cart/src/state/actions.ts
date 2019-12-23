const Actions = createActions({
	SET_CART: (cart: Cart, state) => ({ cart })

	ADD_PRODUCT_TO_CART: (product: Product) => (dispatch, getState) => {
		
	},
	CHANGE_CART_NAME: (name: string) => (dispatch, getState) => {
		const cart = getState(getCart())
		cart.name = name;
		dispatch(setCart(cart));

	}


	ON_CART_CHANGE
});

function incrementIfOdd() {
	return (dispatch, getState) => {
	  const { counter } = getState();
  
	  if (counter % 2 === 0) {
		return;
	  }
  
	  dispatch(increment());
	};
  }