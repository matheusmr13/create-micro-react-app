const { copyTemplateTo, writeJson, readJson } = require('../utils/fs');
const { createExecutionContext } = require('../utils/process');

const moduleScripts = {
  build: 'microfrontend-controller build',
  start: 'microfrontend-controller start',
};

const moduleLibScripts = {
  ...moduleScripts,
  'build-lib': 'microfrontend-controller build -l ./src/lib/schema.js',
};

const addScriptsToPackageJson = async (packageJsonPath, scripts) => {
  const packageJson = await readJson(packageJsonPath);
  packageJson.scripts = { ...packageJson.scripts, ...scripts };
  await writeJson(packageJsonPath, packageJson);
};

const createModule = async (name, template, rootAppPath, isLib = false) => {
  const { execInPackages, execInApp } = createExecutionContext(rootAppPath, name);

  await execInPackages(`npx create-react-app ${name}`);
  await copyTemplateTo(template, `${rootAppPath}/packages/${name}`);

  await execInApp('yarn add microfrontend-controller');
  await execInApp('yarn add react-microfrontend');

  const scripts = isLib ? moduleLibScripts : moduleScripts;
  await addScriptsToPackageJson(`${rootAppPath}/packages/${name}/package.json`, scripts);
};

module.exports = {
  createModule,
  addScriptsToPackageJson,
};
