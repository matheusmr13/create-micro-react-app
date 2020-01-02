const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const escapePackageName = packageName => packageName.replace(/@/g, '').replace(/\//g, '_');

module.exports = {
  resolveApp,
  appPackageJson: resolveApp('package.json'),
  escapePackageName,
};
