const { writeJson, readJson, writeFile } = require('../utils/fs');
const { createModule } = require('./module');

const { explain } = require('../utils/log');
const { resolveApp } = require('../utils/paths');
const { createExecutionContext } = require('../utils/process');

const addMainLibToPackageJson = async (packageJsonPath, main) => {
  const packageJson = await readJson(packageJsonPath);
  packageJson.main = main;
  await writeJson(packageJsonPath, packageJson);
};

const createLibIndex = async (libIndexPath, name) => {
  const content = `import { CreateLib } from 'react-microfrontend';
import schema from './schema';

const api = CreateLib(schema, { apiAccess: CreateLib.BUILD_TYPE.PRIVATE_API, packageName: "${name}" });

api.onInitialize(() => {
  api.setExample([]);
  api.onAddExampleCartCalled(item => {
    const example = api.getExample();
    example.push(item);
    api.setExample(example);
  });
})

export default api;`;

  await writeFile(libIndexPath, content);
};

const addBuildLibToGitIgnore = async (rootAppPath, name) => {
  const { execInApp } = createExecutionContext(rootAppPath, name);
  await execInApp('echo /build-lib >> .gitignore');
};

const createMicrofrontend = async (name, folder = '.') => {
  await explain(
    'Creating microfrontend',
    () => createModule(name, 'microfrontend', resolveApp(folder)),
  );
};

const createMicrofrontendWithLibrary = async (name, folder = '.') => {
  await explain(
    'Creating microfrontend with library',
    async () => {
      const rootAppPath = resolveApp(folder);
      const basePath = `${rootAppPath}/packages/${name}`;

      await createModule(name, 'microfrontend-library', rootAppPath, true);
      await addMainLibToPackageJson(`${basePath}/package.json`, './build-lib/index.js');
      await createLibIndex(`${basePath}/src/lib/index.js`, name);
      await addBuildLibToGitIgnore(rootAppPath, name);
    },
  );
};

module.exports = {
  createMicrofrontend,
  createMicrofrontendWithLibrary,
};
