const { getAppFile, isDirectory, getDirectories, promiseWriteFile, promiseReadJson } = require('../utils/fs');
const { promiseExec, execSync } = require('../utils/process');
const generateServiceWorker = require('../utils/create-sw');
const semver = require('semver')

const buildAllConfigurationsFile = getAppFile('build-configuration.js');
if (!buildAllConfigurationsFile) throw new Error('"build-configuration.js" should exist in root project');

const buildAllConfigurations = buildAllConfigurationsFile();

const {
	shouldBuildPackages = false,
	app,
	microfrontendsToBuild,
	packagesFolder = 'packages',
	microfrontendFolderName = 'microfrontends',
	allBuildsFolder = 'builds',
	distFolder = 'build'
} = buildAllConfigurations;

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
const buildMicrofrontend = async(package) => {
	await buildPackage(package);
	await promiseExec(`rm ${[
		'asset-manifest.json',
		'index.html',
		'manifest.json',
		'precache-manifest*',
		'robots.txt',
		'service-worker.js'
	].map(file => `./${packagesFolder}/${package}/build/${file}`).join(' ')}  || true 2> /dev/null `)
}
const buildApp = async(package) => {
	await buildPackage(package);
	await promiseExec(`rm ${[
		`${microfrontendFolderName}/meta.json`,
		'service-worker.js'
	].map(file => `./${packagesFolder}/${package}/build/${file}`).join(' ')}  || true 2> /dev/null `)
}
  

const buildAll = async () => {
	if (!app) throw new Error('Configuration "app" is required.');

	await promiseExec(`rm -rf ${distFolder} || true 2> /dev/null `);

	if (shouldBuildPackages) {
		if (!microfrontendsToBuild) throw new Error('Configuration "microfrontendsToBuild" is required.');

		await promiseExec(`rm -rf ${allBuildsFolder} || true 2> /dev/null `);
		await promiseExec(`mkdir ${allBuildsFolder}`);
		await Promise.all(
			[
				...(microfrontendsToBuild.map(package => buildMicrofrontend(package))),
				buildApp(app)
			]
		)

		const packages = [...microfrontendsToBuild, app];
		for (let i=0; i < packages.length;i++) {
			const package = packages[i];
			await promiseExec(`cp -r ./${packagesFolder}/${package}/build ./${allBuildsFolder}/${package}`);
		}
	}

	microfrontends = getDirectories(`./${allBuildsFolder}`)
		.map(dir => {
			const parts = dir.split('/');
			return parts[parts.length - 1];
		})
		.filter(moduleName => moduleName !== app);
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