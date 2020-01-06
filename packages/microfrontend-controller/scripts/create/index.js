const { createMicrofrontend, createMicrofrontendWithLibrary } = require('./microfrontend');
const createApp = require('./app');
const { createStandaloneLibrary } = require('./library');

const TYPE = {
  APP: 'APP',
  MICROFRONTEND: 'MICROFRONTEND',
  LIBRARY: 'LIBRARY',
};

const create = async (types, name, opts) => {
  const {
    pathToCreate = '.',
    template, // TODO: implement this with create react app
  } = opts;

  const hasType = type => types.indexOf(type) > -1;
  const shouldCreateApp = hasType(create.TYPE.APP);
  const shouldCreateMicro = hasType(create.TYPE.MICROFRONTEND);
  const shouldCreateLib = hasType(create.TYPE.LIBRARY);

  if (shouldCreateApp) {
    await createApp(name);
  }

  if (shouldCreateMicro) {
    const microfrontendName = shouldCreateApp ? 'microfrontend' : name;
    const pathToCreateMicro = shouldCreateApp ? name : pathToCreate;
    if (shouldCreateLib) {
      await createMicrofrontendWithLibrary(microfrontendName, pathToCreateMicro);
    } else {
      await createMicrofrontend(microfrontendName, pathToCreateMicro);
    }
    return;
  }

  if (shouldCreateLib) {
    const libName = (shouldCreateApp) ? 'library' : name;
    const pathToCreateLib = (shouldCreateApp) ? name : pathToCreate;
    await createStandaloneLibrary(libName, pathToCreateLib);
  }
};

create.TYPE = TYPE;

module.exports = create;
