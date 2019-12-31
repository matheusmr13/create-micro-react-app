const { getAppFile, promiseWriteFile,getReactAppRewiredPath } = require('../utils/fs');
const { promiseExec, getEnvString } = require('../utils/process');

const package = getAppFile('package.json');

const start = async () => {
	await promiseExec(`${getEnvString()} ${getReactAppRewiredPath()} start --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
}


module.exports = start;
