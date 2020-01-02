const { getPackagesFromConfig } = require('../utils/config');
const { copyFolder, rm, mkdir } = require('../utils/fs');
const { escapePackageName } = require('../utils/paths');

const { exec } = require('../utils/process');

const allBuildsFolder = 'builds';

const buildPackage = async packageToBuild => exec(`npm run --prefix ${packageToBuild} build`, { debug: true });

const buildAll = async (opts) => {
  const {
    microfrontends,
    app,
  } = await getPackagesFromConfig(opts.configurationFile, opts);

  await rm(allBuildsFolder);
  await mkdir(allBuildsFolder);

  const allPackages = { ...microfrontends, ...app };

  await Promise.all(Object.keys(allPackages).map(async (packageToBuild) => {
    const pathToBuild = allPackages[packageToBuild];

    const escapedPackageName = escapePackageName(packageToBuild);
    await buildPackage(pathToBuild);
    await copyFolder(`${pathToBuild}/build`, `./${allBuildsFolder}/${escapedPackageName}`);
  }));
};

module.exports = buildAll;
