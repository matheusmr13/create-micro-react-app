const { copyTemplateTo, writeJson, readJson } = require('../utils/fs');
const { createExecutionContext } = require('../utils/process');

const getModuleScripts = isMicrofrontend => ({
  ...(isMicrofrontend ? {
    build: 'microfrontend-controller build -m',
    'build:standalone': 'microfrontend-controller build -s',
  } : {
    build: 'microfrontend-controller build -s',
  }),
  start: 'microfrontend-controller start',
});

const addScriptsToPackageJson = async (packageJsonPath, scripts) => {
  const packageJson = await readJson(packageJsonPath);
  packageJson.scripts = { ...packageJson.scripts, ...scripts };
  await writeJson(packageJsonPath, packageJson);
};

const createModule = async (name, template, rootAppPath) => {
  const { execInPackages, execInApp } = createExecutionContext(rootAppPath, name);

  await execInPackages(`npx create-react-app ${name}`);
  await copyTemplateTo(template, `${rootAppPath}/packages/${name}`);

  await execInApp('yarn add microfrontend-controller');
  await execInApp('yarn add react-microfrontend');

  await addScriptsToPackageJson(`${rootAppPath}/packages/${name}/package.json`, getModuleScripts(template === 'microfrontend'));
};

module.exports = {
  createModule,
  addScriptsToPackageJson,
};
