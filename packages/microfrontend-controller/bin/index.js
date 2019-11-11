#!/usr/bin/env node

const { promiseExec } = require('../utils/process');
const { getAppFile, fileExistsSync } = require('../utils/fs');

const package = getAppFile('package.json');

const args = process.argv.slice(2);
const script = args[0];


({
	build: async () => {
		const build = require('../scripts/build');
		await build();
	},
	start: async () => {
		const build = require('../scripts/build');
		await start();
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
