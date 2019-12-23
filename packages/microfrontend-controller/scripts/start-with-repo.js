const { getAppFile, isDirectory, getDirectories, promiseWriteFile, resolveApp } = require('../utils/fs');
const { promiseExec, execSync } = require('../utils/process');

const startReactApp = async (pathToPackage, port, isMicro) => {
	await promiseExec(`PORT=${port} ${isMicro ? 'IS_MICROFRONTEND=true' : ''} npm run --prefix ${pathToPackage} start`);
}
const microfrontendFolderName = 'microfrontends';

const REPOS = getAppFile('microfrontend-repos.json');
if (!REPOS) console.warn('"microfrontend-repos.json" not specified, assuming all microfrontends are located on ./packages');

const APP_DEFAULT_PATH = 'webapp';

const {
	microfrontends,
	app
} = (REPOS || ({
	app: `./packages/${APP_DEFAULT_PATH}`,
	microfrontends: getDirectories('./packages')
		.map(dir => {
			const parts = dir.split('/');
			return parts[parts.length - 1];
		}).filter(a => a.slice(a.length - APP_DEFAULT_PATH.length) !== APP_DEFAULT_PATH)
		.reduce((agg, package) => Object.assign(agg, { [package]: `./packages/${package}` }), {})
}));

const getRealName = (path) => {
	const pkg = getAppFile(`${path}/package.json`);

	return pkg.name;
}

const microfrontendsWithRealNames = Object.values(microfrontends).reduce((agg, microfrontendPath) =>  Object.assign(agg, {
	[getRealName(microfrontendPath)]: microfrontendPath
}), {});

const startAll = async () => {
	const INITIAL_PORT = 3001;

	const metaJson = Object.keys(microfrontendsWithRealNames).reduce((agg, package, i) => ({
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
			...(Object.values(microfrontends).map((packagePath, i) => startReactApp(packagePath, INITIAL_PORT + i, true))),
			startReactApp(app, 3000)
		]
	)
}
module.exports = startAll;