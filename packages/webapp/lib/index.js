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
  build: async ({ env }) => {
    const envVars = Object.keys(env)
      .map((key) => `REACT_APP_${key}='${env[key]}'`)
      .join(' ');

    const command = `${envVars} npm run build`;
    console.info(command);
    await exec(command, { cwd: `${__dirname}/../` });
    return `${__dirname}/../build`;
  },
};
