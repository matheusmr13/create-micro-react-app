const { createModule } = require('./module');
const { createLibrary } = require('./library');

const { explain } = require('../utils/log');
const { resolveApp } = require('../utils/paths');

const createMicrofrontend = async (name, folder = '.') => {
  await explain(
    'Creating microfrontend',
    () => createModule(name, 'microfrontend', resolveApp(folder)),
  );
};

const createMicrofrontendWithLibrary = async (name, folder = '.') => {
  await explain(
    'Creating microfrontend with library',
    () => createLibrary(name, folder, 'microfrontend-library'),
  );
};

module.exports = {
  createMicrofrontend,
  createMicrofrontendWithLibrary,
};
