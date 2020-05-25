# Microfrontend world

## Basic creation

Create a repository on github and name it "my-microfrontend-market"
Clone it
`microfrontend-controller create -am`
push && build && publish it

## Marketplace

Login with github
Generate github developer key
Go to profile and save it
Import application
Import microfrontend
Deploy application && show changes

## Simplicity to add new microfrontend

Create new repo
Clone it
`microfrontend-controller create -m`
push && build && publish it
Import microfrontend
Deploy application && show changes

## Namespaces

Change some substancial stuff from first microfrontend (background color? :D)
push && build && publish it
Create a namespace named BETA
Choose new microfrontend version for new namespace
Deploy application
Deploy application && show changes

## Example application

Show application

- Cart -> Has state Cart with itens
- Showcase -> Add item to cart -> Has state with filter by
- Promotions -> List some promotions that filters itens on Showcase
- Design System -> Responsible for all buttons on the page

Design System -> Version 1 (black and white, hard corners, monospaced) | Version 2 (colorfull, rounded, comic sans)
