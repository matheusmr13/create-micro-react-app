const { isDirectory, getDirectories, promiseWriteFile, promiseReadJson } = require('../utils/fs');
const { promiseExec, execSync } = require('../utils/process');
const generateServiceWorker = require('../utils/create-sw');
const semver = require('semver');
const projectConfigurations = require('../config/project-configs');

const {
	app,
	microfrontendsToBuild,
	packagesFolder,
	microfrontendFolderName,
	allBuildsFolder,
	distFolder,
	shouldBuildPackages
} = projectConfigurations;

let microfrontends;
const mapMicrofrontend = async (folder) => {
	if (!isDirectory(folder)) throw new Error('Specified path is not a folder');

	const microfrontendsDirs = getDirectories(folder);

	const meta = microfrontendsDirs.reduce((agg, dir) => {
		const parts = dir.split('/');
		const moduleName = parts[parts.length - 1];
		const findResult = execSync(`find ${dir}`);

		const files = findResult
			.toString()
			.split('\n')
			.map(f => f.replace(dir, ''))
			.filter(f => !!f && f.indexOf('.') > -1)
			.reduce((fileTypes, file) => {
				if (file.endsWith('.js')) {
					fileTypes.js.push(`./${microfrontendFolderName}/${moduleName}${file}`);
				} else if (file.endsWith('.css')) {
					fileTypes.css.push(`./${microfrontendFolderName}/${moduleName}${file}`);
				}
				return fileTypes;
			}, { js: [], css: []});

		agg[moduleName] = files;
		return agg;
	}, {});

	return meta;
};

const depsCheck = async () => {
	const allPackages = [app, ...microfrontends];
	const depsPerPackage = {};
	for (let i=0; i < allPackages.length;i++) {
		const package = allPackages[i];
		depsPerPackage[package] = await promiseReadJson(`./${allBuildsFolder}/${package}/deps.json`);
	}

	const allDepsObj = Object.values(depsPerPackage).reduce((distinct, deps) => Object.assign(distinct, deps), {});
	const allDepsList = Object.keys(allDepsObj);

	const allPackagesPerVersion = {};
	for (let i=0; i < allDepsList.length;i++) {
		const dep = allDepsList[i];

		packagesPerVersion = {};

		Object.keys(depsPerPackage).forEach((package) => {
			const packageDeps = depsPerPackage[package];
			const packageVersion = packageDeps[dep] && semver.coerce(packageDeps[dep]);

			if (packageVersion) {
				const majorVersion = packageVersion.major;
				packagesPerVersion[majorVersion] = packagesPerVersion[majorVersion] || [];
				packagesPerVersion[majorVersion].push(package);
			}
		});

		allPackagesPerVersion[dep] = packagesPerVersion;
	}

	const errorMessages = [];

	Object.keys(allPackagesPerVersion).forEach((package) => {
		const packagesPerMajorVersion = allPackagesPerVersion[package];

		const majorVersions = Object.keys(packagesPerMajorVersion);

		if (majorVersions.length > 1) {
			errorMessages.push(`Multiple major versions (with breaking changes) from "${package}" found:`);
			majorVersions.forEach((majorVersion) => {
				errorMessages.push(`   Major version "${majorVersion}" on your project "${packagesPerMajorVersion[majorVersion]}".`);
			})
		}
	});

	if (errorMessages.length > 0) {
		throw new Error(`
			Error checking dependencies of your projects.

			${errorMessages.join('\n')}
		`);
	}
}

const buildPackage = async (package) => await promiseExec(`npm run --prefix ./packages/${package} build`);

const buildAll = async () => {
	if (!app) throw new Error('Configuration "app" is required.');

	await promiseExec(`rm -rf ${distFolder} || true 2> /dev/null `);

	microfrontends = getDirectories(`./${allBuildsFolder}`)
		.map(dir => {
			const parts = dir.split('/');
			return parts[parts.length - 1];
		})
		.filter(moduleName => moduleName !== app);

	if (shouldBuildPackages) {
		await promiseExec(`rm -rf ${allBuildsFolder} || true 2> /dev/null `);
		await promiseExec(`mkdir ${allBuildsFolder}`);
		await Promise.all(
			[
				...(microfrontends),
				app
			].map(package => buildPackage(package))
		)

		const packages = [...microfrontends, app];
		for (let i=0; i < packages.length;i++) {
			const package = packages[i];
			await promiseExec(`cp -r ./${packagesFolder}/${package}/build ./${allBuildsFolder}/${package}`);
		}
	}

	
	await depsCheck();
	
	await promiseExec(`cp -r ./${allBuildsFolder}/${app} ./${distFolder}`);
	await promiseExec(`rm ./${distFolder}/deps.json`);
	await promiseExec(`mkdir -p ./${distFolder}/${microfrontendFolderName}`);

	for (let i=0; i < microfrontends.length;i++) {
		const package = microfrontends[i];
		await promiseExec(`cp -r ./${allBuildsFolder}/${package} ./${distFolder}/${microfrontendFolderName}/${package}`);
		await promiseExec(`rm ./${distFolder}/${microfrontendFolderName}/${package}/deps.json`);
	}

	const metaMicrofrontend = await mapMicrofrontend(`./${distFolder}/${microfrontendFolderName}`);
	await promiseWriteFile(`./${distFolder}/${microfrontendFolderName}/meta.json`, JSON.stringify(metaMicrofrontend, null, 2));
	await promiseExec(`rm -rf ${distFolder}/service-worker.js || true 2> /dev/null `);
	await generateServiceWorker(distFolder);
}

module.exports = buildAll;