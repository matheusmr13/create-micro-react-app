const { resolveApp, appPackageJson } = require('../utils/paths');
const { escapePackageName } = require('../utils/paths');
const { readJson, rm, mkdir, copyFile, writeFile } = require('../utils/fs');

const getExtension = (file) => {
  const parts = file.split('.');
  return parts[parts.length - 1];
};

const build = async ({ pathToSchema }) => {
  const buildLibFolder = resolveApp('build-lib');
  const packageJson = await readJson(appPackageJson);
  // const escapedPackageName = escapePackageName(packageJson.name);

  await rm(buildLibFolder);
  await mkdir(buildLibFolder);

  await copyFile(resolveApp(pathToSchema), `${buildLibFolder}/lib.${getExtension(pathToSchema)}`);

  await writeFile(
    `${buildLibFolder}/index.js`,
    `
    import { Api } from './lib';
    export default lib.private();
  `
  );
};

module.exports = build;
