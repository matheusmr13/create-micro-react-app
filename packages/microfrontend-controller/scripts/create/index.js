const createMicrofrontend = require('./microfrontend');
const createApp = require('./app');

class CreateApp {
  static TYPE = {
    APP: 'APP',
    MICROFRONTEND: 'MICROFRONTEND',
    LIBRARY: 'LIBRARY'
  }

  static async create(types, name, opts) {
    const {
      pathToCreate = '.',
      template // TODO: implement this with create react app
    } = opts;

    const hasType = type => types.indexOf(type) > -1;
    let shouldCreateApp = hasType(CreateApp.TYPE.APP);
    let shouldCreateMicro = hasType(CreateApp.TYPE.MICROFRONTEND);
    let shouldCreateLib = hasType(CreateApp.TYPE.LIBRARY);

    if (shouldCreateApp) {
      await createApp(name);
    }
    if (shouldCreateMicro) {
      const microfrontendName = shouldCreateApp ? 'microfrontend' : name;
      const pathToCreateMicro = shouldCreateApp ? name : pathToCreate;
      await createMicrofrontend(microfrontendName, pathToCreateMicro);
    }
    if (shouldCreateLib) {
      console.info('create lib')
    }
  }
}

module.exports = CreateApp;
