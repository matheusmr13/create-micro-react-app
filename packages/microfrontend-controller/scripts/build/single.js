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
};

module.exports = build;
