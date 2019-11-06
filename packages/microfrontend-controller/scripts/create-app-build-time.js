#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const promiseExec = (command) => new Promise((resolve, reject) => {
	const execution = exec(command, (err) => {
		if (err) return reject(err);
		resolve()
	})
	execution.stdout.pipe(process.stdout);
	return execution;
});

const promiseReadFile = (file) => new Promise((resolve, reject) => {
	fs.readFile(file, 'utf8', function(err, contents) {
		if (err) return reject (err);
		resolve(contents);
	});
})

const promiseWriteFile = (file, content) => new Promise((resolve, reject) => {
	fs.writeFile(file, content, function(err) {
		if (err) return reject (err);
		resolve();
	});
})

const packages = [
	'react-module-1',
	'react-module-2'
];

const app = 'react-app'

const build = async () => {
	await Promise.all(
		[...packages, app].map(package => promiseExec(`npm run --prefix ./packages/${package} build`))
	)

	await promiseExec('rm -rf build || true')
	await promiseExec(`cp -r ./packages/${app}/build .`);
	await promiseExec('mkdir build/microfrontends');

	let scripts = '';
	for (let i=0;i<packages.length;i++) {
		const package = packages[i];
		await promiseExec(`cp -r ./packages/${package}/build ./build/microfrontends/${package}`);
		
		const indexHtmlFilename = `./build/microfrontends/${package}/index.html`;
		const indexHtml = await promiseReadFile(indexHtmlFilename);
		const dom = new JSDOM(indexHtml).window.document;
		dom.querySelectorAll('script').forEach(tag => {
			if (tag.src) {
				tag.src = `/microfrontends/${package}${tag.src}`;
			}
			scripts += tag.outerHTML;
		})

		await promiseWriteFile(indexHtmlFilename, dom.documentElement.outerHTML)
	}

	const indexHtmlFilename = `./build/index.html`;
	const indexHtml = await promiseReadFile(indexHtmlFilename);
	const dom = new JSDOM(indexHtml).window.document;

	dom.body.innerHTML = `${dom.body.innerHTML}${scripts}`;

	await promiseWriteFile(indexHtmlFilename, dom.documentElement.outerHTML)
}

build();