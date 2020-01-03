const { copyFolder, rm, mkdir,writeJson, getDirectories, readJson, getAllFilesFromDir } = require('../utils/fs');
const { exec } = require('../utils/process');
const { escapePackageName, resolveApp } = require('../utils/paths');
const generateServiceWorker = require('../utils/create-sw');

const semver = require('semver');

const distFolder = 'build';
const	microfrontendFolderName = 'microfrontends';
const allBuildsFolder = 'builds';


const mapMicrofrontend = async (microfrontends) => {
  const meta = await Promise.all(microfrontends.map(async (moduleName) => {

    const dir = resolveApp(`./${allBuildsFolder}/${moduleName}`);
    const findResult = await getAllFilesFromDir(dir);

    const files = findResult
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

    return {
      files,
      moduleName
    }
  }));

  return meta.reduce((agg, { moduleName, files }) => Object.assign(agg, {[moduleName]: files}), {});
};

const depsCheck = async (allPackages) => {
  const depsPerPackage = {};
  for (let i=0; i < allPackages.length;i++) {
    const packageName = allPackages[i];
    depsPerPackage[packageName] = await readJson(`./${allBuildsFolder}/${packageName}/deps.json`);
  }

  const allDepsObj = Object.values(depsPerPackage).reduce((distinct, deps) => Object.assign(distinct, deps), {});
  const allDepsList = Object.keys(allDepsObj);

  const allPackagesPerVersion = {};
  for (let i=0; i < allDepsList.length;i++) {
    const dep = allDepsList[i];

    packagesPerVersion = {};

    Object.keys(depsPerPackage).forEach((packageModule) => {
      const packageDeps = depsPerPackage[packageModule];
      const packageVersion = packageDeps[dep] && semver.coerce(packageDeps[dep]);

      if (packageVersion) {
        const majorVersion = packageVersion.major;
        packagesPerVersion[majorVersion] = packagesPerVersion[majorVersion] || [];
        packagesPerVersion[majorVersion].push(packageModule);
      }
    });

    allPackagesPerVersion[dep] = packagesPerVersion;
  }

  const errorMessages = [];

  Object.keys(allPackagesPerVersion).forEach((packageModule) => {
    const packagesPerMajorVersion = allPackagesPerVersion[packageModule];

    const majorVersions = Object.keys(packagesPerMajorVersion);

    if (majorVersions.length > 1) {
      errorMessages.push(`Multiple major versions (with breaking changes) from "${packageModule}" found:`);
      majorVersions.forEach((majorVersion) => {
        errorMessages.push(`   Major version "${majorVersion}" on your project "${packagesPerMajorVersion[majorVersion]}".`);
      })
    }
  });

  if (errorMessages.length > 0) {
    throw new Error(`
      Error checking dependencies of your projects.

      ${errorMessages.join('\n')}
    `);
  }
}



const packageAll = async (opts) => {
  const {
    webappName = 'webapp'
  } = opts;

  const escapedWebappPackageName = escapePackageName(webappName);
  await rm(distFolder);

  const allPackages = await getDirectories(`./${allBuildsFolder}`);
  microfrontends = allPackages.filter(moduleName => moduleName !== escapedWebappPackageName);

  await depsCheck(allPackages);

  await copyFolder(`./${allBuildsFolder}/${escapedWebappPackageName}`, `./${distFolder}`);
  await rm(`./${distFolder}/deps.json`);
  await rm(`./${distFolder}/service-worker.js`);
  await mkdir(`./${distFolder}/${microfrontendFolderName}`);

  for (let i=0; i < microfrontends.length;i++) {
    const package = microfrontends[i];

    await Promise.all([
      'asset-manifest.json',
      'index.html',
      'manifest.json',
      'precache-manifest*',
      'robots.txt',
      'service-worker.js',
      'deps.json'
    ].map(file => rm(`./${allBuildsFolder}/${package}/${file}`)));

    await copyFolder(`./${allBuildsFolder}/${package}`, `./${distFolder}/${microfrontendFolderName}/${package}`);
  }

  const metaMicrofrontend = await mapMicrofrontend(microfrontends);
  await writeJson(`./${distFolder}/${microfrontendFolderName}/meta.json`, metaMicrofrontend);
  await generateServiceWorker(distFolder);
}

module.exports = packageAll;
