const { getPackagesFromConfig } = require('../utils/config');
const { copyFolder, rm, mkdir } = require('../utils/fs');
const { escapePackageName } = require('../utils/paths');

const { exec } = require('../utils/process');

const allBuildsFolder = 'builds';

const buildPackage = async (packageToBuild, isMicro) =>
  exec(`npm run --prefix ${packageToBuild} build`);

const buildAll = async (opts) => {
  const {
    microfrontends,
    app,
  } = await getPackagesFromConfig(opts.configurationFile, opts);

  await rm(allBuildsFolder);
  await mkdir(allBuildsFolder);

  const allPackages = { ...microfrontends, ...app };
  const appName = Object.keys(app)[0];

  await Promise.all(Object.keys(allPackages).map(async (packageToBuild) => {
    const pathToBuild = allPackages[packageToBuild];

    const escapedPackageName = escapePackageName(packageToBuild);
    await buildPackage(pathToBuild, packageToBuild === appName);
    await copyFolder(`${pathToBuild}/build`, `./${allBuildsFolder}/${escapedPackageName}`);
  }));
};

module.exports = buildAll;
