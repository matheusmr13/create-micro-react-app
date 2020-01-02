const { resolveApp } = require('../utils/paths');
const { readJson, getDirsFrom } = require('../utils/fs');
const { escapePackageName } = require('./paths');

const defaults = {
  microfrontendFolderName: 'microfrontends',
};

const getConfigurationBasedOnFolders = async (webappName = 'webapp') => {
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

  let app;
  const microfrontends = microfrontendInfos
    .reduce((agg, microfrontendInfo) => {
      if (microfrontendInfo.moduleName === webappName) {
        app = { [microfrontendInfo.moduleName]: microfrontendInfo.path };
        return agg;
      }

      return Object.assign(agg, {
        [microfrontendInfo.moduleName]: microfrontendInfo.path,
      });
    }, {});

  return ({
    app,
    microfrontends,
  });
};

const getPackagesFromConfig = async (configurationFilePath, opts) => {
  try {
    return readJson(resolveApp(configurationFilePath));
  } catch (e) {
    console.warn('Configuration file not specified, assuming all microfrontends are located on ./packages');
    return getConfigurationBasedOnFolders(opts.webappName);
  }
};

module.exports = {
  ...defaults,
  getPackagesFromConfig,
};
