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

const createModule = async (name, template, rootAppPath, isRootPath = false) => {
  const { execInPackages, execInApp, execInRootApp, execInRoot } = createExecutionContext(rootAppPath, name);

  if (isRootPath) {
    await execInRoot(`npx create-react-app ${name}`);

    await appendFile(`${rootAppPath}/.gitignore`, ['build-lib', 'public/meta.json'].join('\n'));
    await copyTemplateTo(template, rootAppPath);

    await execInRootApp('yarn add @cmra/cli');
    await execInRootApp('yarn add @cmra/react');

    await addScriptsToPackageJson(
      `${rootAppPath}/${name}/package.json`,
      getModuleScripts(template === 'microfrontend')
    );
  } else {
    await execInPackages(`npx create-react-app ${name}`);

    await appendFile(`${rootAppPath}/packages/${name}/.gitignore`, ['build-lib', 'public/meta.json'].join('\n'));
    await copyTemplateTo(template, `${rootAppPath}/packages/${name}`);

    await execInApp('yarn add @cmra/cli');
    await execInApp('yarn add @cmra/react');

    await addScriptsToPackageJson(
      `${rootAppPath}/packages/${name}/package.json`,
      getModuleScripts(template === 'microfrontend')
    );
  }
};

module.exports = {
  createModule,
  addScriptsToPackageJson,
};
