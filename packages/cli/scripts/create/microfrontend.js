const { createModule } = require('./module');
const { createLibrary } = require('./library');

const { writeFile } = require('../utils/fs');
const { explain } = require('../utils/log');
const { resolveApp, resolvePackageSrc } = require('../utils/paths');

const indexJsFile = (packageName) => `
import { ExportMicrofrontend } from '@cmra/react';
import App from './App';

ExportMicrofrontend({
  name: '${packageName}',
  view: App,
});
`;

const createMicrofrontendWithTemplate = async (name, folder, isRootPath) => {
  await createModule(name, 'microfrontend', resolveApp(folder), isRootPath);
  if (isRootPath) {
    await writeFile(resolveApp(folder, name, 'src', 'index.js'), indexJsFile(name));
  } else {
    await writeFile(resolvePackageSrc(folder, name, 'index.js'), indexJsFile(name));
  }
};

const createMicrofrontend = async (name, folder = '.', isRootPath) => {
  await explain('Creating microfrontend', () => createMicrofrontendWithTemplate(name, folder, isRootPath));
};

const createMicrofrontendWithLibrary = async (name, folder = '.') => {
  await explain('Creating microfrontend with library', () => createLibrary(name, folder, 'microfrontend-library'));
};

module.exports = {
  createMicrofrontend,
  createMicrofrontendWithLibrary,
};
