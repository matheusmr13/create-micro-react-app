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
const REACT_APP = /^REACT_APP_/i;

const getEnvString = () => {
	const envs = Object.keys(process.env)
		.filter(key => REACT_APP.test(key))
		.reduce((env, key) => Object.assign(env, { [key]: process.env[key] }), {
			...(process.env.REACT_APP_IS_MICROFRONTEND ? { REACT_APP_IS_MICROFRONTEND : true } : {}),
			...(process.env.REACT_APP_IS_MICROFRONTEND ? { BROWSER : 'none' } : {}),
			PORT: process.env.PORT || 3000,
			REACT_APP_PACKAGE_NAME: package.name,
			SKIP_PREFLIGHT_CHECK: true
		});

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
		const buildAll = require('../scripts/build-all');
		await buildAll();
	},
	"start-all": async() => {
		const startAll = require('../scripts/start-all');
		await startAll();
	}
}[script])();
