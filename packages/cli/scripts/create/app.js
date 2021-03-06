const { createModule, addScriptsToPackageJson } = require('./module');

const { explain } = require('../utils/log');
const { mkdir, copyTemplateTo } = require('../utils/fs');
const { resolveApp } = require('../utils/paths');
const { createExecutionContext } = require('../utils/process');

const rootAppScripts = (webappName) => ({
  postinstall: 'lerna bootstrap',
  build: 'yarn build:packages && yarn package',
  'build:packages': `cmra build -a ${webappName}`,
  package: `cmra build -p ${webappName}`,
  start: `cmra start -a ${webappName}`,
});

const createApp = async (name, opts = {}) => {
  const { webappName = 'webapp' } = opts;

  const rootAppPath = resolveApp(name);

  const { execInRoot } = createExecutionContext(rootAppPath, webappName);

  const configureRootApp = async () => {
    await execInRoot('yarn init --yes');
    await copyTemplateTo('app', rootAppPath);

    await execInRoot('yarn add lerna@"<4.0.0"');
    await execInRoot('yarn add @cmra/cli');

    await addScriptsToPackageJson(`${rootAppPath}/package.json`, rootAppScripts(webappName));
  };

  await explain('Creating folder', () => mkdir(`${name}/packages`));

  await explain('Configuring root app and webapp', () =>
    Promise.all([configureRootApp(), createModule(webappName, 'webapp', rootAppPath)])
  );
};

module.exports = createApp;
