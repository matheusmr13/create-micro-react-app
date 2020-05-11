#!/usr/bin/env node

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

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

const run = async () => {
  exec(`REACT_APP_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID} npm start`, { cwd: './packages/marketplace-frontend' });
  exec(
    `$(gcloud beta emulators datastore env-init) && GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID} GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET} npm run start:watch`,
    {
      cwd: './packages/marketplace-backend',
    }
  );
  exec('gcloud beta emulators datastore start');
};

run();
