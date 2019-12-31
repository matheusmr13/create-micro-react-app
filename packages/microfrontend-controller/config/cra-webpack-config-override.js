
const { override, overrideDevServer } = require('customize-cra');
const { microfrontendFolderName } = require('../scripts/utils/config');
const { appPackageJson } = require('../scripts/utils/paths');

// eslint-disable-next-line
const packageJson = require(appPackageJson);

const overrideWebpackConfigs = () => (config) => {
  const newConfig = { ...config };
  newConfig.output.jsonpFunction = packageJson.name;

  if (process.env.NODE_ENV === 'production') {
    if (process.env.IS_MICROFRONTEND) {
      newConfig.output.publicPath = `./${microfrontendFolderName}/${packageJson.name}/`;
    }
  } else if (process.env.IS_MICROFRONTEND) {
    newConfig.output.publicPath = `http://localhost:${process.env.PORT}/`;
  }

  return newConfig;
};

const overrideDevServerConfigs = () => (config) => {
  const newConfig = { ...config };
  if (process.env.IS_MICROFRONTEND) {
    newConfig.headers = {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    };
  }
  return newConfig;
};

module.exports = {
  webpack: override(overrideWebpackConfigs()),
  devServer: overrideDevServer(overrideDevServerConfigs()),
};
