#!/usr/bin/env node

const { promiseExec } = require('../utils/process');

const args = process.argv.slice(2);
const script = args[0];


({
	build: async () => {
		await promiseExec(`node_modules/react-app-rewired/bin/index.js build --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
	},
	"build-all": async() => {
		const buildAll = require('../scripts/build-all');
		await buildAll();
	}
}[script])();
