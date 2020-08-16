const { resolveApp, appPackageJson } = require('../../utils/paths');
const { escapePackageName } = require('../../utils/paths');
const { readJson, rm, mkdir, copyFile, writeFile } = require('../../utils/fs');

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

  await copyFile(resolveApp(fileToBuild), `${buildLibFolder}/schema.${getExtension(fileToBuild)}`);

  await writeFile(
    `${buildLibFolder}/index.js`,
    `
    import { CreateLib } from '@cmra/react';
    import schema from './schema';

    export default CreateLib(schema, {
      apiAccess: CreateLib.BUILD_TYPE.PUBLIC_API,
      packageName: "${escapedPackageName}"
    });
  `
  );
};

module.exports = build;
