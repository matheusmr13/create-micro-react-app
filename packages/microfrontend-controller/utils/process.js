
const { exec, execSync, spawn } = require('child_process');
const { getAppFile } = require('./fs');

const package = getAppFile('package.json');

const promiseExec = (command) => new Promise((resolve, reject) => {
	const ls = spawn(command, [], { shell: true});

	ls.stdout.on('data', function (data) {
		console.log(data.toString());
	});

	ls.stderr.on('data', function (data) {
		console.log(data.toString());
	});

	ls.on('exit', function (code) {
		// console.log('child process exited with code ' + code.toString());
		resolve();
	});
});

const REACT_APP = /^REACT_APP_/i;

const getEnvString = () => {
	const envs = Object.keys(process.env)
		.filter(key => REACT_APP.test(key))
		.reduce((env, key) => Object.assign(env, { [key]: process.env[key] }), {
			...(process.env.REACT_APP_IS_MICROFRONTEND ? { REACT_APP_IS_MICROFRONTEND : true } : {}),
			...(process.env.REACT_APP_IS_MICROFRONTEND ? { BROWSER : 'none' } : {}),
			PORT: process.env.PORT || 3000,
			REACT_APP_PACKAGE_NAME: package.name,
			SKIP_PREFLIGHT_CHECK: true
		});

	return Object.keys(envs).map(env => `${env}=${envs[env]}`).join(' ');
}

module.exports = {
	promiseExec,
	execSync,
	getEnvString
};