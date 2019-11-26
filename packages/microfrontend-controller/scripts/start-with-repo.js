const { getAppFile, isDirectory, getDirectories, promiseWriteFile, resolveApp } = require('../utils/fs');
const { promiseExec, execSync } = require('../utils/process');

const startReactApp = async (pathToPackage, port) => {
	await promiseExec(`PORT=${port} npm run --prefix ${pathToPackage} start`);
}
const microfrontendFolderName = 'microfrontends';

const REPOS = getAppFile('microfrontend-repos.json');
if (!REPOS) throw new Error('microfrontend-repos.json is required');
const {
	microfrontends,
	app
} = REPOS;

const startAll = async () => {
	const INITIAL_PORT = 3001;

	const metaJson = Object.keys(microfrontends).reduce((agg, package, i) => ({
		[package]: {
			js: [],
			css: [],
			host: `http://localhost:${INITIAL_PORT+i}`
		},
		...agg
	}), {});

	await promiseWriteFile(`${app}/public/${microfrontendFolderName}/meta.json`, JSON.stringify(metaJson, null, 2));

	await Promise.all(
		[
			...(Object.keys(microfrontends).map((package, i) => startReactApp(microfrontends[package], INITIAL_PORT + i))),
			startReactApp(app, 3000)
		]
	)
}
module.exports = startAll;