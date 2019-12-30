const fs = require('fs');
const fse = require('fs-extra');
const path = require('path')
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const getAppFile = (file) => {
	const filePath = resolveApp(file);
	if (!fs.existsSync(filePath)) return null;
	return require(resolveApp(file));
}

const promiseWriteFile = (file, content) => fse.outputFile(file, content);
const promiseReadJson = (file) => fse.readJson(file);

const isDirectory = source => fs.statSync(source).isDirectory()
const getDirectories = source =>
  fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

const fileExistsSync = file => fs.existsSync(file);

const getReactAppRewiredPath = () => {
	const options = [
		`${__dirname}/../../react-app-rewired/bin/index.js`,
		`${__dirname}/../node_modules/react-app-rewired/bin/index.js`
	];
	return options.find(path => fileExistsSync(path));
}

const copyFile = async (file, location) => {
	await fse.mkdirp((file).split('/').slice(0, -1).join('/'), 0o2775);
	const content = await fse.readFile(location);
	await promiseWriteFile(file, content);
}

const mergeDirs = async (src, dest) => {
	const files = await fse.readdir(src);
  
	return Promise.all(files.map((file) => new Promise(async (resolve) => {
	  const srcFile = '' + src + '/' + file
	  const destFile = '' + dest + '/' + file
  
	  if (isDirectory(srcFile)) {
		await mergeDirs(srcFile, destFile)
	  } else {
		await copyFile(destFile, srcFile)
	  }
	  resolve();
	})));
  }

module.exports = {
	getAppFile,
	promiseWriteFile,
	isDirectory,
	getDirectories,
	resolveApp,
	fileExistsSync,
	getReactAppRewiredPath,
	promiseReadJson,
	promiseDeleteFile: fse.remove,
	mergeDirs,
	promiseFileExists: fse.exists
}