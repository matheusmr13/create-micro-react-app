const { createModule } = require('./module');

const { explain } = require('../utils/log');
const { resolveApp } = require('../utils/paths');

const createMicrofrontend = async (name, folder = '.') => {
  await explain(
    'Creating microfrontend',
    () => createModule(name, 'microfrontend', resolveApp(folder)),
  );
};

module.exports = createMicrofrontend;
