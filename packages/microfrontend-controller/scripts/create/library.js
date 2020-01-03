const { copyTemplateTo, writeJson, readJson } = require('../utils/fs');
const { createExecutionContext } = require('../utils/process');

const { explain } = require('../utils/log');
const { resolveApp } = require('../utils/paths');

const createLibrary = async (name, folder = '.') => {
  await explain(
    'Creating library',
    async () => {
      const rootAppPath = resolveApp(folder);
      const { execInPackages, execInApp } = createExecutionContext(rootAppPath, name);

      await execInPackages(`mkdir ${name}`);
      await copyTemplateTo('library', `${rootAppPath}/packages/${name}`);

      await execInApp('yarn add microfrontend-controller');
      await execInApp('yarn add react-microfrontend');

      const packageJsonPath = `${rootAppPath}/packages/${name}/package.json`;

      const packageJson = await readJson(packageJsonPath);
      packageJson.name = `@app/${name}`;
      await writeJson(packageJsonPath, packageJson);
    },
  );
};

module.exports = createLibrary;
