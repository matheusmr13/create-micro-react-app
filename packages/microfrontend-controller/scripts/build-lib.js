const { resolveApp, promiseWriteFile } = require('../utils/fs');
const { promiseExec } = require('../utils/process');

const buildLibFolder = resolveApp('build-lib');

const build = async (fileToBuild) => {
	await promiseExec(`rm -rf ${buildLibFolder} || true 2> /dev/null `);
	await promiseExec(`mkdir ${buildLibFolder}`);
	await promiseExec(`cp ${fileToBuild} ${buildLibFolder}/schema.js`);

	await promiseWriteFile(`${buildLibFolder}/index.js`, `
		import { CreateLib } from 'react-microfrontend';
		import schema from './schema';

		export default CreateLib(schema, CreateLib.BUILD_TYPE.PUBLIC_API);
	`);
}

module.exports = build;