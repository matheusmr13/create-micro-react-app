const { getAppFile, mergeDirs, promiseWriteFile } = require('../utils/fs');
const { promiseExec } = require('../utils/process');

const newPackageScripts = {
	scripts: {
		"build": "microfrontend-controller build",
		"start": "microfrontend-controller start"
	}
};

const createMicrofrontend = async (name, folder = '.') => {
	const newAppPath = folder;
	const exec = (command, path) => promiseExec(command, { cwd: `${newAppPath}/packages/${path || ''}` });

	await exec(`npx create-react-app ${name} --template typescript`);
	await mergeDirs(`${__dirname}/../templates/microfrontend`, `${newAppPath}/packages/${name}`);
	await exec(`yarn add microfrontend-controller`, `/${name}`);
	await exec(`yarn add react-microfrontend`, `/${name}`);

	const packageJsonPath = `${newAppPath}/packages/${name}/package.json`;
	const packageJson = getAppFile(packageJsonPath);
	await promiseWriteFile(packageJsonPath, JSON.stringify(Object.assign({}, packageJson, newPackageScripts), null, 2));
}

module.exports = createMicrofrontend;