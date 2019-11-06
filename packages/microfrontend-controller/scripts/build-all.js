const { getAppFile, isDirectory, getDirectories, promiseWriteFile } = require('../utils/fs');
const { promiseExec, execSync } = require('../utils/process');
const generateServiceWorker = require('../utils/create-sw');

const buildAllConfigurationsFile = getAppFile('build-configuration.js');
if (!buildAllConfigurationsFile) throw new Error('"build-configuration.js" should exist in root project');

const buildAllConfigurations = buildAllConfigurationsFile();

const {
	shouldBuildPackages = false,
	app,
	microfrontends,
	packagesFolder = 'packages',
	microfrontendFolderName = 'microfrontends',
	allBuildsFolder = 'builds',
	distFolder = 'build'
} = buildAllConfigurations;

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
	if (!microfrontends || !app) throw new Error('Configuration "microfrontends" and "app" are required.');

	await promiseExec(`rm -rf ${distFolder} || true 2> /dev/null `);

	if (shouldBuildPackages) {
		await promiseExec(`rm -rf ${allBuildsFolder} || true 2> /dev/null `);
		await promiseExec(`mkdir ${allBuildsFolder}`);
		await Promise.all(
			[
				...(microfrontends.map(package => buildMicrofrontend(package))),
				buildApp(app)
			]
		)

		const packages = [...microfrontends, app];
		for (let i=0; i < packages.length;i++) {
			const package = packages[i];
			await promiseExec(`cp -r ./${packagesFolder}/${package}/build ./${allBuildsFolder}/${package}`);
		}
	}

	
	await promiseExec(`cp -r ./${allBuildsFolder}/${app} ./${distFolder}`);
	await promiseExec(`mkdir -p ./${distFolder}/${microfrontendFolderName}`);

	for (let i=0; i < microfrontends.length;i++) {
		const package = microfrontends[i];
		await promiseExec(`cp -r ./${allBuildsFolder}/${package} ./${distFolder}/${microfrontendFolderName}/${package}`);
	}

	const metaMicrofrontend = await mapMicrofrontend(`./${distFolder}/${microfrontendFolderName}`);
	await promiseWriteFile(`./${distFolder}/${microfrontendFolderName}/meta.json`, JSON.stringify(metaMicrofrontend, null, 2));
	await promiseExec(`rm -rf ${distFolder}/service-worker.js || true 2> /dev/null `);
	await generateServiceWorker(distFolder);
}

module.exports = buildAll;