#!/usr/bin/env node
const express = require('express');
const cypress = require('cypress');
const { rm, mkdir, symlink, isDirectory } = require('../../@cmra/cli/scripts/utils/fs'); // TODO: fix this dep
const { exec } = require('../../@cmra/cli/scripts/utils/process'); // TODO: fix this dep
const { explain } = require('../../@cmra/cli/scripts/utils/log'); // TODO: fix this dep

const cleanUp = async () => {
  await rm('e2e-dist');
  await mkdir('e2e-dist');
};

const createApp = async () => {
  await exec(`${__dirname}/../../@cmra/cli/bin/index.js create my-app -am`, { cwd: './e2e-dist' });
};

const createSymlinks = async () => {
  const checkNodeModules = async (pathToNodeModules, library, mountPath) => {
    const pathToLib = `${pathToNodeModules}/${library}`;
    try {
      await rm(pathToLib);
    } catch (e) {}
    await symlink(mountPath(library), pathToLib);
  };

  const checkNodeModulesDevPackage = (pathToNodeModules, library) =>
    checkNodeModules(pathToNodeModules, library, (lib) => `${process.cwd()}/../${lib}`);
  const checkNodeModulesReactPackage = (pathToNodeModules, library) =>
    checkNodeModules(pathToNodeModules, library, (lib) => `${process.cwd()}/../@cmra/react/node_modules/${lib}`);

  const checkAllDepsFromPackage = async (packageName) => {
    await checkNodeModulesDevPackage(`./e2e-dist/my-app/packages/${packageName}/node_modules`, '@cmra/cli');
    await checkNodeModulesDevPackage(`./e2e-dist/my-app/packages/${packageName}/node_modules`, '@cmra/react');
    await checkNodeModulesReactPackage(`./e2e-dist/my-app/packages/${packageName}/node_modules`, 'react');
    await checkNodeModulesReactPackage(`./e2e-dist/my-app/packages/${packageName}/node_modules`, 'react-dom');
  };

  await checkNodeModulesDevPackage('./e2e-dist/my-app/node_modules', '@cmra/cli');
  await checkAllDepsFromPackage('webapp');
  await checkAllDepsFromPackage('microfrontend');
};

const build = async () => {
  await exec('yarn --cwd ./e2e-dist/my-app build');
};

const serve = async () => {
  const app = express();
  app.use(express.static('./e2e-dist/my-app/build'));
  return app.listen(8081);
};

const runTests = async () =>
  cypress.run({
    browser: 'chrome',
    config: {
      baseUrl: `http://localhost:${8081}`,
      video: true,
    },
    exit: true,
  });

const run = async () => {
  await cleanUp();
  await createApp();
  await createSymlinks();
  await build();

  const server = await serve();
  const results = await runTests();
  server.close();

  if (results.totalFailed > 0) {
    throw new Error('Tests failed');
  }
};

run();
