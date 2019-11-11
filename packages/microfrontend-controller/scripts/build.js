const { getAppFile, promiseWriteFile, getReactAppRewiredPath } = require('../utils/fs');
const { promiseExec, getEnvString } = require('../utils/process');

const package = getAppFile('package.json');

const build = async () => {
	await promiseExec(`${getEnvString()} ${getReactAppRewiredPath()} build --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
	await promiseWriteFile('build/deps.json', JSON.stringify(package.dependencies));
}

module.exports = build;