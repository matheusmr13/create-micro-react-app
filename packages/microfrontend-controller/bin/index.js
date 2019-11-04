#!/usr/bin/env node

const { promiseExec } = require('../utils/process');
const { getAppFile, fileExistsSync } = require('../utils/fs');

const package = getAppFile('package.json');

const args = process.argv.slice(2);
const script = args[0];

const getReactAppRewiredPath = () => {
	const options = [
		`${__dirname}/../../react-app-rewired/bin/index.js`,
		`${__dirname}/../node_modules/react-app-rewired/bin/index.js`
	];
	return options.find(path => fileExistsSync(path));
}

const getEnvString = () => {
	const envs = {
		...(process.env.REACT_APP_IS_MICROFRONTEND ? { REACT_APP_IS_MICROFRONTEND : true } : {}),
		...(process.env.REACT_APP_IS_MICROFRONTEND ? { BROWSER : 'none' } : {}),
		PORT: process.env.PORT || 3000,
		REACT_APP_PACKAGE_NAME: package.name
	};

	return Object.keys(envs).map(env => `${env}=${envs[env]}`).join(' ');
}
({
	build: async () => {
		await promiseExec(`${getEnvString()} ${getReactAppRewiredPath()} build --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
	},
	start: async () => {
		await promiseExec(`${getEnvString()} ${getReactAppRewiredPath()} start --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
	},
	"build-all": async() => {
		console.info
		const buildAll = require('../scripts/build-all');
		await buildAll();
	},
	"start-all": async() => {
		const startAll = require('../scripts/start-all');
		await startAll();
	}
}[script])();
