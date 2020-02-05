root_dir=$(pwd)


link_example_deps() {
	cd node_modules
	rm -r microfrontend-controller 2> /dev/null
	rm -r react-microfrontend 2> /dev/null

	ln -s "${root_dir}/packages/microfrontend-controller/" microfrontend-controller
	ln -s "${root_dir}/packages/react-microfrontend/" react-microfrontend
	cd ..
}

setup_examples() {
  link_example_deps
  cd ./examples
  for D in `ls .`
  do
    cd $D
    link_example_deps
    cd ..
  done
  cd ..
}

recreate_package() {
  rm -r node_modules 2> /dev/null
  rm -r yarn.lock 2> /dev/null
  yarn
}

recreate() {
  lerna clean -y
  rm -r node_modules 2> /dev/null
  rm -r yarn.lock 2> /dev/null
  lerna bootstrap
  yarn

  cd ./packages
  for D in `ls .`
  do
    cd $D
    recreate_package
    cd ..
  done
  cd ..

  setup_examples
}

recreate
