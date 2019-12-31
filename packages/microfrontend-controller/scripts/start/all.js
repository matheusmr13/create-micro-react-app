const { resolveApp } = require('../utils/paths');
const { readJson, getDirsFrom, writeJson } = require('../utils/fs');
const { microfrontendFolderName } = require('../utils/config');
const startSingleApp = require('./single');

const getConfigurationBasedOnFolders = async (webappName) => {
  const packages = await getDirsFrom('./packages');

  const microfrontendInfos = await Promise.all(packages
    .map(async (dir) => {
      const packageJson = await readJson(resolveApp(`${dir}/package.json`));
      const packageName = packageJson.name;

      return {
        moduleName: packageName,
        path: `./${dir}`,
      };
    }));

  let appDir;
  const microfrontends = microfrontendInfos
    .reduce((agg, microfrontendInfo) => {
      if (microfrontendInfo.moduleName === webappName) {
        appDir = microfrontendInfo.path;
        return agg;
      }

      return Object.assign(agg, {
        [microfrontendInfo.moduleName]: microfrontendInfo.path,
      });
    }, {});

  return ({
    app: appDir,
    microfrontends,
  });
};

const getConfiguration = async (configurationFilePath, opts) => {
  try {
    return readJson(resolveApp(configurationFilePath));
  } catch (e) {
    console.warn('Configuration file not specified, assuming all microfrontends are located on ./packages');

    const {
      webappName = 'webapp',
    } = opts;
    return getConfigurationBasedOnFolders(webappName);
  }
};

const startMultipleLocations = async (configurationFilePath, opts = {}) => {
  const {
    microfrontends,
    app,
  } = await getConfiguration(configurationFilePath, opts);

  const INITIAL_PORT = 3001;

  const metaJson = Object.keys(microfrontends).reduce((agg, packageName, i) => Object.assign(agg, {
    [packageName]: {
      host: `http://localhost:${INITIAL_PORT + i}`,
    },
  }), {});

  await writeJson(`${app}/public/${microfrontendFolderName}/meta.json`, metaJson);

  Object.values(microfrontends)
    .forEach((packagePath, i) => startSingleApp({
      pathToPackage: packagePath,
      port: INITIAL_PORT + i,
      isMicro: true,
      isRunningAll: true,
    }));

  startSingleApp({
    pathToPackage: app,
    port: 3000,
    isRunningAll: true,
  });
};

module.exports = startMultipleLocations;
