const { resolveApp, promiseWriteFile, getAppFile } = require('../utils/fs');
const { promiseExec } = require('../utils/process');

const buildLibFolder = resolveApp('build-lib');

const getExtension = (file) => {
  const parts = file.split('.');
  return parts[parts.length -1 ];
}

const build = async (fileToBuild) => {
	await promiseExec(`rm -rf ${buildLibFolder} || true 2> /dev/null `);
	await promiseExec(`mkdir ${buildLibFolder}`);
	await promiseExec(`cp ${resolveApp(fileToBuild)} ${buildLibFolder}/schema.${getExtension(fileToBuild)}`);
	const packageJson = getAppFile('package.json');

	await promiseWriteFile(`${buildLibFolder}/index.js`, `
		import { CreateLib } from 'react-microfrontend';
		import schema from './schema';

		export default CreateLib(schema, {
			apiAccess: CreateLib.BUILD_TYPE.PUBLIC_API,
			packageName: "${packageJson.name}"
		});
	`);
}

module.exports = build;
