lerna bootstrap
yarn

root_dir=$(pwd)
link_deps () {
	cd node_modules
	rm -r microfrontend-controller
	rm -r react-microfrontend

	ln -s "${root_dir}/../../packages/microfrontend-controller/" microfrontend-controller
	ln -s "${root_dir}/../../packages/react-microfrontend/" react-microfrontend
	cd ..
}

link_deps

cd ./packages
for D in `ls .`
do
    cd $D
	link_deps
	cd ..
done