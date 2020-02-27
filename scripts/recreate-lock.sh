root_dir=$(pwd)
set -e

debug () {
  echo "===================================="
  echo "===================================="
  echo "$1 $(pwd)"
  echo "===================================="
  echo "===================================="
}

delete_yarn_lock() {
  debug "delete_yarn_lock"
  rm -rf yarn.lock 2> /dev/null
}

link_example_deps() {
  debug "link_example_deps"
	cd node_modules
  echo "removing deps"

	rm -rf microfrontend-controller 2> /dev/null
	rm -rf react-microfrontend 2> /dev/null

  echo "linking again"
	ln -s "${root_dir}/packages/microfrontend-controller/" microfrontend-controller
	ln -s "${root_dir}/packages/react-microfrontend/" react-microfrontend
  echo "linking done"

	cd ..
}

setup_examples() {
  debug "setup_examples"
  cd ./examples
  examples=$(ls .)
  for D in $examples
  do
    cd $D
    recreate "examples"
    cd ..
  done
  cd ..
}

recreate() {
  debug "recreate"

  lerna clean -y

  cd ./packages
  packages=$(ls .)
  for D in $packages
  do
    cd $D
    delete_yarn_lock
    cd ..
  done

  cd ..

  rm -rf node_modules 2> /dev/null
  rm -rf yarn.lock 2> /dev/null
  lerna bootstrap
  yarn

  if [[ $1 = "examples" ]]; then

    echo "to aqui antes do link_example_deps $(pwd)"
    link_example_deps
    echo "to aqui depois do link $(pwd)"
    cd ./packages

    for D in $packages
    do
      cd $D
      link_example_deps
      cd ..
    done

    cd ..
  fi
}

# recreate
setup_examples
