const { spawn } = require('child_process');
const express = require('express')

app.use(express.static('public'))


const isRunningServer = async () => {
  try {
    await fetch('http://localhost:3000');
    return true;
  } catch(e) {
    return false;
  }
};

const delay = async (timeToDelay) => new Promise(resolve => setTimeout(resolve, timeToDelay));

const exec = async (command) => new Promise((resolve) => {
  const [first, ...rest] = command.split(' ');
  const child = spawn(first, rest, { stdio: "inherit" });
  child.on('close', function (code) {
    console.log(`Exited process "${command}" with code ${code}`);
    resolve(code);
  });
});

const startServer = async () => {
  exec('yarn start');
  const checkConnection = async () => {
    console.info('Checking connection.');
    const isRunning = await isRunningServer();
    if (!isRunning) {
      await delay(500);
      return await checkConnection();
    }
  }
  await checkConnection();
  await delay(3000);
};

const initialize = async () => {
  const isRunning = await isRunningServer();
  if (!isRunning) {
    console.info('Server not initialized. Initializing...');
    await startServer();
  }
  console.info('Server initialized.');
}

const runTests = async () => {
  await initialize();
  const exitCode = await exec('yarn test:e2e:cypress:local');
  process.exit(exitCode);
}

runTests();
