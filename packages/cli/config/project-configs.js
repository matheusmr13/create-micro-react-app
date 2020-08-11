const { getAppFile } = require('../utils/fs');

const buildAllConfigurationsFile = getAppFile('build-configuration.js');
const buildAllConfigurations = buildAllConfigurationsFile();

const defaults = {
  shouldBuildPackages: false,
  app: 'webapp',
  packagesFolder: 'packages',
  microfrontendFolderName: 'microfrontends',
  allBuildsFolder: 'builds',
  distFolder: 'build',
};


module.exports = { ...defaults, ...buildAllConfigurations };
