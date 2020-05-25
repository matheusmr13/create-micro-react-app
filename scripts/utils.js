const { spawn } = require('child_process');

const exec = (command, { cwd, onStdout, onStderr, debug = true } = {}) =>
  new Promise((resolve, reject) => {
    const spawnProcess = spawn(command, [], { shell: true, cwd });

    if (onStdout || debug) spawnProcess.stdout.on('data', onStdout || ((data) => process.stdout.write(data)));
    if (onStderr || debug) spawnProcess.stderr.on('data', onStderr || ((data) => process.stderr.write(data)));

    spawnProcess.on('exit', (code) => {
      if (code > 0) {
        reject(code);
        return;
      }
      resolve();
    });
  });

module.exports = {
  exec,
};
