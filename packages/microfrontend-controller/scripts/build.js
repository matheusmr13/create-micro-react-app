const { getAppFile, promiseWriteFile, getReactAppRewiredPath } = require('../utils/fs');
const { promiseExec, getEnvString } = require('../utils/process');

const package = getAppFile('package.json');

const build = async () => {
	await promiseExec(`${getEnvString()} ${getReactAppRewiredPath()} build --config-overrides ${__dirname}/../config/cra-webpack-config-override.js`);
	await promiseWriteFile('build/deps.json', JSON.stringify(package.dependencies));

	if (process.env.IS_MICROFRONTEND) {
		await promiseExec(`rm ${[
			'asset-manifest.json',
			'index.html',
			'manifest.json',
			'precache-manifest*',
			'robots.txt',
		].map(file => `./build/${file}`).join(' ')}  || true 2> /dev/null `)
	}
	await promiseExec('rm ./build/service-worker.js');
}

module.exports = build;