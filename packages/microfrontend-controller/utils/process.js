
const { exec, execSync } = require('child_process');

const promiseExec = (command) => new Promise((resolve, reject) => {
	const execution = exec(command, (err) => {
		if (err) return reject(err);
		resolve()
	})
	execution.stdout.pipe(process.stdout);
	return execution;
});

module.exports = {
	promiseExec,
	execSync
};