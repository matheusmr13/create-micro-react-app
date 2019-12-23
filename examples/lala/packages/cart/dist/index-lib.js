"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
require("reflect-metadata");
var react_microfrontend_1 = require("react-microfrontend");
var Cart_1 = require("./Cart");
function microfrontendApi(OriginalClass) {
    console.info('name', OriginalClass);
    var shared = new react_microfrontend_1.Shared(OriginalClass.name);
    var properties = Reflect.getMetadata(Symbol('observable'), OriginalClass);
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.subscribe = function (property, callback) {
        };
        return class_1;
    }(OriginalClass));
}
function observable(target, key) {
    var value;
    var getter = function () {
        console.log("Get => " + key);
        return value;
    };
    var setter = function (newVal) {
        console.log("Set: " + key + " => " + newVal);
        value = newVal;
    };
    Object.defineProperty(target[key], 'subscribe', {
        value: function () {
            console.info('subcribeeeee');
        }
    });
    // Object.defineProperty(target, key, {
    //   value: {
    //     get() {
    //         console.info('pegando');
    //         return value;
    //     },
    //     set(newValue) {
    //         console.info(process.env.REACT_APP_IS_CONTAINER)
    //         console.info(process.env.REACT_APP_IS_MICROFRONTEND)
    //         console.info('setando e dando dispatch');
    //         value = newValue;
    //         this.callbackFunc && this.callbackFunc(newValue);
    //     },
    //     subscribe(callback) {
    //         this.callbackFunc = callback;
    //     }
    //   },
    //    writable: true
    // });
}
var CartApi = /** @class */ (function () {
    function CartApi() {
    }
    // @dispatcher('cart')
    CartApi.addProductInCart = function (product) {
        var clone = Object.assign(new Cart_1["default"](), this.cart);
        clone.items.push(product);
        this.cart = clone;
    };
    CartApi.cart = new Cart_1["default"]();
    __decorate([
        observable
    ], CartApi, "cart");
    CartApi = __decorate([
        microfrontendApi
    ], CartApi);
    return CartApi;
}());
exports["default"] = CartApi;
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
