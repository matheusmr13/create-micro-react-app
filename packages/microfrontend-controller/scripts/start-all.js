#!/usr/bin/env node

const { getAppFile, isDirectory, getDirectories, promiseWriteFile, resolveApp } = require('../utils/fs');
const { promiseExec, execSync } = require('../utils/process');

const net = require('net');
const { spawn } = require('child_process');

const buildAllConfigurations = (getAppFile('build-configuration.js'))();
const {
	shouldBuildPackages = false,
	app,
	microfrontends,
	packagesFolder = 'packages',
	microfrontendFolderName = 'microfrontends',
	allBuildsFolder = 'builds',
	distFolder = 'build'
} = buildAllConfigurations;


const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;

const reactProcess = spawn('npm', ['--prefix', 'packages/web', 'run', 'start']);
reactProcess.stdout.on('data', (data) => {
  console.log(`${data}`);
});

const tryConnection = () => client.connect({ port }, () => {
  client.end();

  if (!startedElectron) {
    console.log('Starting electron');
    startedElectron = true;

    const electronProcess = spawn('npm', ['--prefix', 'packages/desktop', 'run', 'start']);
    electronProcess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    electronProcess.on('exit', function(code, signal){
        console.log('App quit');
        electronProcess.stdin.pause();
        electronProcess.kill();
        reactProcess.stdin.pause();
        reactProcess.kill();
        process.exit(0);
    });
  }
});

client.on('error', () => {
  setTimeout(tryConnection, 1000);
});

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
			...(microfrontends.map((package, i) => startReactApp(package, INITIAL_PORT + i), true)),
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