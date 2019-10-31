#!/usr/bin/env node

const { exec, execSync } = require('child_process');
const fs = require('fs');
const jsdom = require("jsdom");
const { join } = require('path');

const promiseExec = (command) => new Promise((resolve, reject) => {
	const execution = exec(command, (err) => {
		if (err) return reject(err);
		resolve()
	})
	execution.stdout.pipe(process.stdout);
	return execution;
});


const promiseWriteFile = (file, content) => new Promise((resolve, reject) => {
	fs.writeFile(file, content, function(err) {
		if (err) return reject (err);
		resolve();
	});
})

const isDirectory = source => fs.statSync(source).isDirectory()
const getDirectories = source =>
  fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const mapMicrofrontend = async (folder) => {
  if (!isDirectory(folder)) throw new Error('Specified path is not a folder');

  const microfrontendsDirs = getDirectories(folder);

  const meta = microfrontendsDirs.reduce((agg, dir) => {
    const parts = dir.split('/');
	const mf = parts[parts.length - 1];
	const findResult = execSync(`find ${dir}`);
	const files = findResult
		.toString()
		.split('\n')
		.map(f => f.replace(dir, ''))
		.filter(f => !!f && f.indexOf('.') > -1)
		.reduce((fileTypes, file) => {
			if (file.endsWith('.js')) {
				fileTypes.js.push(file);
			} else if (file.endsWith('.css')) {
				fileTypes.css.push(file);
			}
			return fileTypes;
		}, { js: [], css: []});

    agg[mf] = files;
    return agg;
  }, {});

  return meta;
};


const buildPackage = async (package) => await promiseExec(`npm run --prefix ./packages/${package} build`);
const buildMicrofrontend = async(package) => {
	await buildPackage(package);
	await promiseExec(`rm ${[
		'asset-manifest.json',
		'index.html',
		'manifest.json',
		'precache-manifest*',
		'robots.txt',
		'service-worker.js'
	].map(file => `./packages/${package}/build/${file}`).join(' ')}`)
}

const app = 'react-app'

const packages = [
	'react-dynamic-app'
];

const build = async () => {
	await Promise.all(
		[
			...(packages.map(package => buildMicrofrontend(package))),
			buildPackage(app)
		]
	)

	await promiseExec('rm -rf build || true')
	await promiseExec(`cp -r ./packages/${app}/build .`);
	await promiseExec('mkdir build/microfrontends');

	for (let i=0;i<packages.length;i++) {
		const package = packages[i];
		await promiseExec(`cp -r ./packages/${package}/build ./build/microfrontends/${package}`);
	}

	const metaMicrofrontend = await mapMicrofrontend('./build/microfrontends');
	await promiseWriteFile('./build/microfrontends/meta.json', JSON.stringify(metaMicrofrontend));
	await promiseExec('yarn sw-precache');
}

build();