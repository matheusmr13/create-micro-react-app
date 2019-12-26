import { Shared } from 'react-microfrontend';
import Cart from './Cart';


function microfrontendApi (OriginalClass) {

  console.info('name', OriginalClass);
  const shared = new Shared(OriginalClass.name);

  const properties: string[] = Reflect.getMetadata(Symbol('observable'), OriginalClass);


  return class extends OriginalClass {
    static cart
    static addProductInCart
    static subscribe(property, callback) {

      
    }
  }
}

function observable(target, key) {
    let value;
   
    const getter = function() {
      console.log(`Get => ${key}`);
      return value;
    };
   
    const setter = function(newVal) {
      console.log(`Set: ${key} => ${newVal}`);
      value = newVal;
    };
   
    // Object.defineProperty(target[key], 'subscribe', {
    //   value: () => {
    //     console.info('subcribeeeee');
    //   }
    // });
    Object.defineProperty(target, key, {
      value: {
        get() {
            console.info('pegando');
            return value;
        },
        set(newValue) {
            console.info(process.env.REACT_APP_IS_CONTAINER)
            console.info(process.env.REACT_APP_IS_MICROFRONTEND)
            console.info('setando e dando dispatch');
            value = newValue;
            this.callbackFunc && this.callbackFunc(newValue);
        },
        subscribe(callback) {
            this.callbackFunc = callback;
        }
      },
       writable: true
    });
}



@microfrontendApi
class CartApi {

	@observable
	cart: Cart = new Cart();

  // @dispatcher('cart')
	addProductInCart(product) {
    const clone = Object.assign(new Cart(), this.cart);
    clone.items.push(product);
    this.cart = clone;
	}
}


class CartApiJs {
  subscribeToCart = subscriber()
  addProductToCart(product) {

  }
}

// lib
const subscriber = () => {};
const distapcher = () => {};

// api implementada
class CartAPI {
  user = 'user'
  order = 'order'


  subscribeToChangesInOrder = subscriber(this.order);
  subscribeToChangesInUser = subscriber(this.user);

  setUser = setter(this.user);

  addOrderToUser = distapcher(this.user, ({ user }) => (order) => {
    user.addOrder(order);
    return user.clone();
  });

  logout = dispatcher(this.user, ({ user }) => () => {
    user.logout();
    return null;
  })

}



export default CartApi;



// // market


// // cart

// 	class CartItem {
// 		product: Product
// 		quantity: number
// 	}

// 	class Cart {
// 		itens: Array<CartItem>
// 	}


// 	class CartApi {

// 		@observable()
// 		cart(): Cart

// 		@action 
// 		addProduct // Store and ItemDetails micro call to add a product to cart

// 		@action
// 		changeCartItemQuantity(item, quantity) {
// 			sitem.quantity = 
// 		}
// 	}

// // item details

// 	class ItemDetailsApi {
// 		handle
// 	}

// 	// Does ItemDetails need to subscribe to cart change?
// 	CartApi.subscribeToCart((cart) => {
// 	});

// 	//...
// 	handleAddItemClick() {
// 		CartApi.addItem(this.props.currentItem);
// 	}

// // store

// 	class Product {
// 		name: string
// 		price: number
// 	}


// 	class StoreApi {

// 	}