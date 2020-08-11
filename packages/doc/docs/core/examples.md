---
id: examples
title: Examples
---

## Store

Let's use this repository as example: [micro-store](https://github.com/matheusmr13/micro-store);

[Demo](https://matheusmr13.github.io/micro-store/)

Here we have a application that represents a simple store:

- you can browse products
- filter by promotions
- add products to your cart
- access your current cart and remove items

With this features we divided our application in 5 parts (this is just an example, if you are developing a real page as simple as this example, maybe you should not use microfrotend architechture):

- `webapp`: our container page that organize all other microfrontends
- `cart`: exports 2 components (a widget and a full page that shows current cart) and an api that enables adding and removing products from cart
- `showcase`: a list of products with an api to setup type filter that calls `cart` api to add products
- `promotion`: list of filters by type that calls `showcase` api
- `design-system`: used by other microfrontends, exports `Button` component
