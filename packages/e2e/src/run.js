#!/usr/bin/env node
const { rm, mkdir, symlink, isDirectory } = require('../../microfrontend-controller/scripts/utils/fs'); // TODO: fix this dep
const { exec } = require('../../microfrontend-controller/scripts/utils/process'); // TODO: fix this dep
const { explain } = require('../../microfrontend-controller/scripts/utils/log'); // TODO: fix this dep
const express = require('express');
const cypress = require('cypress')

const cleanUp = async () => {
  await rm('e2e-dist');
  await mkdir('e2e-dist');
}

const createApp = async () => {
  await exec(`${__dirname}/../../microfrontend-controller/bin/index.js create my-app -am`, { cwd: './e2e-dist' });
}

const createSymlinks = async () => {
  const checkNodeModules = async(pathToNodeModules, library) => {
    const pathToLib = `${pathToNodeModules}/${library}`;
    try {
      await rm(pathToLib);
    } catch (e) {
      console.info(e);
    }
    await symlink(`${process.cwd()}/../${library}`, pathToLib);
  }

  const checkAllDepsFromPackage = async(package) => {
    await checkNodeModules(`./e2e-dist/my-app/packages/${package}/node_modules`, 'microfrontend-controller');
    await checkNodeModules(`./e2e-dist/my-app/packages/${package}/node_modules`, 'react-microfrontend');
  }

  await checkNodeModules('./e2e-dist/my-app/node_modules', 'microfrontend-controller');
  await checkAllDepsFromPackage('webapp');
  await checkAllDepsFromPackage('microfrontend');
}

const build = async () => {
  await exec('yarn --cwd ./e2e-dist/my-app build');
}

const serve = async () => {
  const app = express();
  app.use(express.static('./e2e-dist/my-app/build'));
  return app.listen(8081);
}

const runTests = async () => {
  const results = await cypress.run({
    browser: 'chrome',
    config: {
      baseUrl: `http://localhost:${8081}`,
      video: true
    },
    exit: true
  });
}

const run = async() => {
  await cleanUp();
  await createApp();
  await createSymlinks();
  await build();

  const server = await serve();
  await runTests();
  server.close();
}


run();
