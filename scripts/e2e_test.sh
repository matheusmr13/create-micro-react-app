#!/bin/bash


mkdir e2e-dist
cd e2e-dist

./packages/microfrontend-controller create-app my-app
./packages/microfrontend-controller create-microfrontend my-micro ./my-app
./packages/microfrontend-controller create-microfrontend my-second-micro ./my-app

cd my-app

echo 'module.exports = () => ({ shouldBuildPackages: true });' > build-configuration.js

npm build