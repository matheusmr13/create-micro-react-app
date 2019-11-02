#!/usr/bin/env node

const { promiseExec } = require('../utils/process');

const args = process.argv.slice(2);
const script = args[0];

({
	build: async () => {
		await promiseExec(`${__dirname}/../node_modules/react-app-rewired/bin/index.js build --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
	},
	start: async () => {
		await promiseExec(`${process.env.REACT_APP_IS_MICROFRONTEND ? 'REACT_APP_IS_MICROFRONTEND=true BROWSER=none ' : ''}PORT=${process.env.PORT || 3000} ${__dirname}/../node_modules/react-app-rewired/bin/index.js start --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
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
