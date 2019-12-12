const { getAppFile, resolveApp, promiseWriteFile, mergeDirs } = require('../utils/fs');
const { promiseExec } = require('../utils/process');

const newScripts = {
	"build": "microfrontend-controller build-all",
	"start": "microfrontend-controller start-with-repo"
};

const newPackageScripts = {
	scripts: {
		"build": "microfrontend-controller build",
		"start": "microfrontend-controller start"
	}
};

const createApp = async (name) => {
	await promiseExec(`mkdir ${name}`);
	await promiseExec(`mkdir ${name}/packages`);

	const newAppPath = resolveApp(name);
	const exec = (command, path) => promiseExec(command, { cwd: `${newAppPath}${path || ''}` });
	
	await exec('yarn init --yes');

	await mergeDirs(`${__dirname}/../templates/app`, resolveApp(name));

	await exec('yarn add lerna@"<4.0.0"');
	await exec(`yarn add microfrontend-controller`);

	const rootPackageJsonPath = resolveApp(`${name}/package.json`);
	const rootPackageJson = getAppFile(rootPackageJsonPath);

	rootPackageJson.scripts = Object.assign({}, rootPackageJson.scripts, newScripts);
	await promiseWriteFile(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2));

	await exec(`npx create-react-app webapp`, '/packages');
	await mergeDirs(`${__dirname}/../templates/webapp`, `${newAppPath}/packages/webapp`);
	await exec(`yarn add microfrontend-controller`, '/packages/webapp');
	await exec(`yarn add react-microfrontend`, '/packages/webapp');

	const packageJsonPath = resolveApp(`${name}/packages/webapp/package.json`);
	const packageJson = getAppFile(packageJsonPath);
	await promiseWriteFile(packageJsonPath, JSON.stringify(Object.assign({}, packageJson, newPackageScripts), null, 2));
}

module.exports = createApp;