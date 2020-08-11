const { createModule } = require('./module');

const { writeJson, readJson, writeFile } = require('../utils/fs');
const { createExecutionContext } = require('../utils/process');
const { explain } = require('../utils/log');
const { resolveApp } = require('../utils/paths');

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
  api.onAddExampleCalled(item => {
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

const createLibrary = async (name, folder = '.', template = 'library') => {
  await explain(
    'Creating library',
    async () => {
      const rootAppPath = resolveApp(folder);
      const basePath = `${rootAppPath}/packages/${name}`;

      await createModule(name, template, rootAppPath, true);
      await addMainLibToPackageJson(`${basePath}/package.json`, './build-lib/index.js');
      await createLibIndex(`${basePath}/src/lib/index.js`, name);
      await addBuildLibToGitIgnore(rootAppPath, name);
    },
  );
};

const deleteUnusedFiles = async (name, folder) => {
  const rootAppPath = resolveApp(folder);
  const { execInApp } = createExecutionContext(rootAppPath, name);

  const filesToDelete = [
    'src/App.*',
    'src/*.css',
    'src/serviceWorker.js',
    'src/setupTests.js',
    'src/logo.*',
  ];

  await execInApp(`rm -f ${filesToDelete.join(' ')}`);
};

const createStandaloneLibrary = async (name, folder = '.') => {
  await explain(
    'Creating standalone library',
    async () => {
      await createLibrary(name, folder);
      await deleteUnusedFiles(name, folder);
    },
  );
};

module.exports = {
  createLibrary,
  createStandaloneLibrary,
};
