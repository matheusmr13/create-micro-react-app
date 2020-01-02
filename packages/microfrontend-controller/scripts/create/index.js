const createMicrofrontend = require('./microfrontend');
const createApp = require('./app');

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
    await createMicrofrontend(microfrontendName, pathToCreateMicro);
  }
  if (shouldCreateLib) {
    console.info('create lib');
  }
};

create.TYPE = TYPE;

module.exports = create;
