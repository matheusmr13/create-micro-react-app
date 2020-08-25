const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolve = (paths) => path.resolve(...[appDirectory].concat(paths));
const resolveApp = (...relativePath) => resolve(relativePath);
const resolvePackageSrc = (relativePath, packageName, file) =>
  resolve([relativePath, 'packages', packageName, 'src', file]);
const escapePackageName = (packageName) => packageName.replace(/@/g, '').replace(/\//g, '_');

module.exports = {
  resolveApp,
  resolvePackageSrc,
  appPackageJson: resolveApp('package.json'),
  escapePackageName,
};
