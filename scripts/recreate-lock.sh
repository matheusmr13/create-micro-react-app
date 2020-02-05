root_dir=$(pwd)



recreate_package() {
  rm -r node_modules 2> /dev/null
  rm -r yarn.lock 2> /dev/null
  yarn
}

link_example_deps() {
	cd node_modules
	rm -r microfrontend-controller 2> /dev/null
	rm -r react-microfrontend 2> /dev/null

	ln -s "${root_dir}/packages/microfrontend-controller/" microfrontend-controller
	ln -s "${root_dir}/packages/react-microfrontend/" react-microfrontend
	cd ..
}

setup_examples() {
  cd ./examples
  for D in `ls .`
  do
    cd $D
    recreate
    cd ..
  done
  cd ..
}

recreate() {
  lerna clean -y
  rm -r node_modules 2> /dev/null
  rm -r yarn.lock 2> /dev/null
  lerna bootstrap
  yarn

  if [ $1 = "examples" ]; then
    link_example_deps
  fi

  cd ./packages
  for D in `ls .`
  do
    cd $D
    recreate_package
    if [ $1 = "examples" ]; then
      link_example_deps
    fi
    cd ..
  done
  cd ..
}

# recreate
setup_examples
