#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
var archiver = require('archiver');
const packageJson = require('./package.json');

const promiseExec = (command) => new Promise((resolve, reject) => {
	const execution = exec(command, (err) => {
		if (err) return reject(err);
		resolve()
	})
	execution.stdout.pipe(process.stdout);
	return execution;
});

const promiseZip = (filename, dir) => new Promise((resolve, reject) => {
	var output = fs.createWriteStream(filename);
	var archive = archiver('zip', {
		zlib: { level: 9 }
	});
	output.on('close', function() {
		resolve();
	});
	archive.pipe(output);
	archive.directory(dir, false);
	archive.finalize();
});

const promiseReq = (file, body) => new Promise((resolve,reject) => {
	const request = require('request');
	const fs = require('fs');
	const url = 'http://localhost:8080/profile';
	var req = request.post(url, function (err, resp, body) {
		if (err) {
			reject(err);
		} else {
			resolve(body);
		}
	});
	var form = req.form();

	Object.keys(body).forEach(key => {
		form.append(key, body[key]);
	})
	form.append('build', fs.createReadStream(file));
})

const build = async () => {
	await promiseExec('npm run build');
	await promiseZip('./build.zip', './build');
	await promiseReq('./build.zip', {
		packageName: packageJson.name
	});
	await promiseExec('rm build.zip');
}

build();