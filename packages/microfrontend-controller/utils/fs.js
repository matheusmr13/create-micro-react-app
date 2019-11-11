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

module.exports = {
	getAppFile,
	promiseWriteFile,
	isDirectory,
	getDirectories,
	resolveApp,
	fileExistsSync,
	getReactAppRewiredPath,
	promiseReadJson
}