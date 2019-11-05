const { getAppFile, isDirectory, getDirectories, promiseWriteFile, resolveApp } = require('../utils/fs');
const { promiseExec, execSync } = require('../utils/process');

const buildAllConfigurationsFile = getAppFile('build-configuration.js');
if (!buildAllConfigurationsFile) throw new Error('"build-configuration.js" should exist in root project');

const buildAllConfigurations = buildAllConfigurationsFile();
const {
	shouldBuildPackages = false,
	app,
	microfrontends,
	packagesFolder = 'packages',
	microfrontendFolderName = 'microfrontends',
	allBuildsFolder = 'builds',
	distFolder = 'build'
} = buildAllConfigurations;

const startReactApp = async (package, port, isMicro) => {
	await promiseExec(`${isMicro ? 'REACT_APP_IS_MICROFRONTEND=true ' : ''}PORT=${port} npm run --prefix ./packages/${package} start`);
}
  
const startAll = async () => {
	if (!microfrontends || !app) throw new Error('Configuration "microfrontends" and "app" are required.');

	// {
	// 	"react-dynamic-app": {
	// 	  "js": [
	// 		"/static/js/runtime-main.e9a7c56a.js",
	// 		"/static/js/2.d7718695.chunk.js",
	// 		"/static/js/main.83e8e9cc.chunk.js"
	// 	  ],
	// 	  "css": [
	// 		"/static/css/main.9cebe428.chunk.css"
	// 	  ]
	// 	}
	//   }

	const INITIAL_PORT = 3001;
	const metaJson = microfrontends.reduce((agg, package, i) => ({
		[package]: {
			js: [
				// `http://localhost:${INITIAL_PORT+i}/static/js/bundle.js`,
				// `http://localhost:${INITIAL_PORT+i}/static/js/0.chunk.js`,
				// `http://localhost:${INITIAL_PORT+i}/static/js/main.chunk.js`
			],
			css: [],
			host: `http://localhost:${INITIAL_PORT+i}`
		},
		...agg
	}), {});

	await promiseWriteFile(`./${packagesFolder}/${app}/public/${microfrontendFolderName}/meta.json`, JSON.stringify(metaJson, null, 2));

	await Promise.all(
		[
			...(microfrontends.map((package, i) => startReactApp(package, INITIAL_PORT + i, true))),
			startReactApp(app, 3000)
		]
	)

	// await promiseExec(`rm -rf ${distFolder} || true`);
	// await promiseExec(`cp -r ./${allBuildsFolder}/${app} ./${distFolder}`);
	// await promiseExec(`mkdir ./${distFolder}/${microfrontendFolderName}`);

	// for (let i=0; i < microfrontends.length;i++) {
	// 	const package = microfrontends[i];
	// 	await promiseExec(`cp -r ./${allBuildsFolder}/${package} ./${distFolder}/${microfrontendFolderName}/${package}`);
	// }

	// const metaMicrofrontend = await mapMicrofrontend(`./${distFolder}/${microfrontendFolderName}`);
	// await promiseWriteFile(`./${distFolder}/${microfrontendFolderName}/meta.json`, JSON.stringify(metaMicrofrontend, null, 2));
	// await promiseExec('yarn sw-precache');
}
module.exports = startAll;