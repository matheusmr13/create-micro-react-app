#!/usr/bin/env node

const { promiseExec } = require('../utils/process');
const { getAppFile } = require('../utils/fs');

const package = getAppFile('package.json');

const args = process.argv.slice(2);
const script = args[0];

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
		await promiseExec(`${getEnvString()} ${__dirname}/../node_modules/react-app-rewired/bin/index.js build --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
	},
	start: async () => {
		await promiseExec(`${getEnvString()} ${__dirname}/../node_modules/react-app-rewired/bin/index.js start --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
	},
	"build-all": async() => {
		const buildAll = require('../scripts/build-all');
		await buildAll();
	},
	"start-all": async() => {
		const startAll = require('../scripts/start-all');
		await startAll();
	}
}[script])();
