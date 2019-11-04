
const { exec, execSync, spawn } = require('child_process');



const promiseExec = (command) => new Promise((resolve, reject) => {
	const ls    = spawn(command, [], { shell: true});

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

module.exports = {
	promiseExec,
	execSync
};