const { copyTemplateTo, writeJson, readJson, appendFile } = require('../utils/fs');
const { createExecutionContext } = require('../utils/process');

const getModuleScripts = (isMicrofrontend) => ({
  ...(isMicrofrontend
    ? {
        build: 'cmra build -m',
        'build:standalone': 'cmra build -s',
      }
    : {
        build: 'cmra build -s',
      }),
  start: 'cmra start',
});

const addScriptsToPackageJson = async (packageJsonPath, scripts) => {
  const packageJson = await readJson(packageJsonPath);
  packageJson.scripts = { ...packageJson.scripts, ...scripts };
  await writeJson(packageJsonPath, packageJson);
};

const createModule = async (name, template, rootAppPath) => {
  const { execInPackages, execInApp } = createExecutionContext(rootAppPath, name);

  await execInPackages(`npx create-react-app ${name}`);
  await appendFile(`${rootAppPath}/packages/${name}/.gitignore`, ['build-lib', 'public/meta.json'].join('\n'));
  await copyTemplateTo(template, `${rootAppPath}/packages/${name}`);

  await execInApp('yarn add @cmra/cli');
  await execInApp('yarn add @cmra/react');

  await addScriptsToPackageJson(
    `${rootAppPath}/packages/${name}/package.json`,
    getModuleScripts(template === 'microfrontend')
  );
};

module.exports = {
  createModule,
  addScriptsToPackageJson,
};
