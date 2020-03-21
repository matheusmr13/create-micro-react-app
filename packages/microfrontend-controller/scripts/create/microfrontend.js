const { createModule } = require('./module');

const { writeFile } = require('../utils/fs');
const { explain } = require('../utils/log');
const { resolveApp, resolvePackageSrc } = require('../utils/paths');


const indexJsFile = packageName => `
import { ExportMicrofrontend } from 'react-microfrontend';
import App from './App';

ExportMicrofrontend({
  name: '${packageName}',
  view: App,
});
`;

const createMicrofrontendWithTemplate = async (name, folder) => {
  await createModule(name, 'microfrontend', resolveApp(folder));
  await writeFile(resolvePackageSrc(folder, name, 'index.js'), indexJsFile(name));
};

const createMicrofrontend = async (name, folder = '.') => {
  await explain(
    'Creating microfrontend',
    () => createMicrofrontendWithTemplate(name, folder),
  );
};

module.exports = createMicrofrontend;
