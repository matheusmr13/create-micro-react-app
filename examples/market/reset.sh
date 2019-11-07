find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

lerna bootstrap && yarn && yarn start-all