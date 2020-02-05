const { resolveApp, appPackageJson } = require('../utils/paths');
const { escapePackageName } = require('../utils/paths');
const {
  readJson, rm, mkdir, copyFile, writeFile,
} = require('../utils/fs');

const getExtension = (file) => {
  const parts = file.split('.');
  return parts[parts.length - 1];
};

const build = async (fileToBuild) => {
  const buildLibFolder = resolveApp('build-lib');
  const packageJson = await readJson(appPackageJson);
  const escapedPackageName = escapePackageName(packageJson.name);

  await rm(buildLibFolder);
  await mkdir(buildLibFolder);

  await copyFile(resolveApp(fileToBuild), `${buildLibFolder}/lib.${getExtension(fileToBuild)}`);

  await writeFile(`${buildLibFolder}/index.js`, `
    import lib from './lib';
    export default lib.private();
  `);
};

module.exports = build;
