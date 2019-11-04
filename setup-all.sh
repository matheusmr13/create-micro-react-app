lerna bootstrap
yarn

cd example
lerna bootstrap
yarn

cd node_modules

rm -r microfrontend-controller
rm -r react-microfrontend

ln -s ../../packages/microfrontend-controller/ microfrontend-controller
ln -s ../../packages/react-microfrontend/ react-microfrontend