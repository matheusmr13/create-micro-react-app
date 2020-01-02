const { readJson, getReactAppRewiredPath, writeJson } = require('../utils/fs');
const { exec } = require('../utils/process');
const { appPackageJson } = require('../utils/paths');
const { getEnvString } = require('../utils/env');

const build = async () => {
  const packageJson = await readJson(appPackageJson);

  const env = getEnvString({ packageJson });
  const reactAppRewiredPath = await getReactAppRewiredPath();

  await exec(`${env} ${reactAppRewiredPath} build --config-overrides ${__dirname}/../../config/cra-webpack-config-override.js`);
  await writeJson('build/deps.json', packageJson.dependencies);

  // if (isMicrofrontend) {
  //   await Promise.all([
  //     'asset-manifest.json',
  //     'index.html',
  //     'manifest.json',
  //     'precache-manifest*',
  //     'robots.txt',
  //   ].map(file => rm(`./build/${file}`)));
  // }
  // await rm('./build/service-worker.js');
};

module.exports = build;
