#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const packageJson = require('../package.json');

const create = require('../scripts/create');
const start = require('../scripts/start');
const build = require('../scripts/build');
const publish = require('../scripts/publish');

program
  .name(Object.keys(packageJson.bin)[0])
  .version(packageJson.version);

program
  .command('start')
  .description('Start your application')
  .option('-c, --configuration-file <configuration_file>', `
    This should be used if you want to start an app where your modules/microfrontends are located on multiple repositories.

    File example "${chalk.italic('my-config.json')}":
    ${chalk.bold(`
      "microfrontends": {
        "my-microfrontend1": "/path/to/microfrontend1/root",
        "my-microfrontend2": "/path/to/microfrontend2/root"
      },
      "app": {
        "my-webapp": "/path/to/app/root"
      }
    `)}
  `)
  .option('-p, --proxy <url>', `
    Start your specific module simulating deployed environment.

    Let's say your application is already deployed to https://my-app.xyz and it has a webapp and 3 other microfrontends.
    If you want to developed some feature on one of this 3 microfrontend, you can do this:

    ${chalk.black.bgWhite(' > microfrontend-controller start -p https://my-app.xyz ')}

    and then:

    Access http://localhost:3000 and you will have a environment with:
    - current deployed webapp version
    - current 2 other microservices versions
    - a devserver running just with your current microfrontend (where you started this command) in development
  `)
  .option('-a, --all <webapp_package_name>', `
    Similar to --configuration-file param but this assumes that all your modules are on same folder in mono repo structure like:
    ${chalk.bold(`
      - package.json
      - packages
      - - webapp
      - - - package.json
      - - microfrontend
      - - - package.json
    `)}

    You can run this command at your root to start this application with all modules in development mode (with hot reload)
  `)
  .action((options) => {
    const opts = {};
    let type = start.TYPE.SINGLE;
    if (options.configurationFile) {
      type = start.TYPE.LOCAL;
      opts.configurationFile = options.configurationFile;
    } else if (options.proxy) {
      type = start.TYPE.PROXY;
      opts.url = options.proxy;
    } else if (options.all) {
      type = start.TYPE.LOCAL;
      opts.webappName = options.all;
    }

    start(type, opts);
  });

program
  .command('build')
  .description('Build your application')
  .option('-p, --package <webapp_package_name>', `
    Assumes that all modules that you want to package with are located on ./builds like:

    ${chalk.bold(`
      - builds
      - - package1
      - - - index.html
      - - - ...
      - - package2
      - - - index.html
      - - - ...
    `)}

    This command package together this folders together to create a deployable package that can be served statically.
    You must specify wich package is the webapp container.
  `)
  .option('-l, --library [library_path]', `
    Build your library to export it.
    ${chalk.black.bgWhite(' > microfrontend-controller build ./src/lib/index.js -l ')}
  `)
  .option('-m, --microfrontend', `
    Build a single module that will become a microfrontend.
  `)
  .option('-s, --stand-alone', `
    Build a single module in stand alone mode. You should also use this for building webapp container module.
  `)
  .option('-a, --all <webapp_package_name>', `
    Build all modules assuming they are located at ./packges, generating all resourcers at ./builds
    Combined with --package can create a ready to deploy application

    ${chalk.black.bgWhite(' > microfrontend-controller build -a my-webapp && microfrontend-controller build -p my-webapp ')}
  `)
  .option('-c, --configuration-file <configuration_file>', `
    This should be used if you want to build an app where your modules/microfrontends are located on multiple repositories.

    File example "${chalk.italic('my-config.json')}":
    ${chalk.bold(`
      "microfrontends": {
        "my-microfrontend1": "/path/to/microfrontend1/root",
        "my-microfrontend2": "/path/to/microfrontend2/root"
      },
      "app": {
        "my-webapp": "/path/to/app/root"
      }
    `)}
  `)
  .action((options) => {
    let type = build.TYPE.SINGLE;
    const opts = {};
    if (options.configurationFile) {
      type = build.TYPE.ALL;
      opts.configurationFile = options.configurationFile;
    } else if (options.all) {
      type = build.TYPE.ALL;
      opts.webappName = options.all;
    } else if (options.library) {
      opts.pathToSchema = options.library;
    } else if (options.package) {
      type = build.TYPE.PACKAGE;
      opts.webappName = options.package;
    }

    opts.shouldBuildStandalone = options.standAlone || !options.microfrontend;

    build(type, opts);
  });

program
  .command('publish')
  .description('Publish on a git branch')
  .action(() => {
    publish();
  });

program
  .command('create <name>')
  .description('create your application')
  .option('-a, --app', `
    Default option if none specified.
    Creates a monorepo application with a webapp template (created with cra)

    ${chalk.black.bgWhite(' > microfrontend-controller create my-app -a ')}
  `)
  .option('-m, --microfrontend', `
    Creates a microfrontend application to be used/imported by a webapp.

    ${chalk.black.bgWhite(' > microfrontend-controller create my-microfrontend -m ')}

    Can be used beside --app parameter to create a webapp with an initial microfrontend like
    ${chalk.black.bgWhite(' > microfrontend-controller create my-app -am ')}
  `)
  .option('-l, --library', `
    Creates a library that can be used by another module. This way you can create a library that has its own deploy or create an api to comunicate with your current microfrontends.

    Example:

    1)
    You want to create a library that has its own deploy
    ${chalk.black.bgWhite(' > microfrontend-controller create my-cool-library -l ')}

    and then import it on others microfrontends like
       ${chalk.bold(' "my-cool-library": "0.1.0" ')}

    When you import this library on another microfrontend you only importing a client to comunicate with it.
    This way your instances of this library is created only once.

    2)
    You want to create a microfrontend named Cart and others microfrontends have to communicate with it.
    ${chalk.black.bgWhite(' > microfrontend-controller create cart -ml ')}

    Other microfrontend:
       ${chalk.bold(' "cart": "0.1.0" ')}

    and then
    ${chalk.bold(`
        import CartApi from 'cart';
        ...
        CartApi.callAddProductToCart(Product.fetchProduct(1234));
    `)}
  `)
  .option('-t, --template <template>', `
    Specified a template to use when creating a microfrontend or an application

    ${chalk.black.bgWhite(' > microfrontend-controller create my-app -a --template typescript ')}
  `)
  .action((name, options) => {
    const opts = {
      template: options.template,
    };

    const types = [];
    if (options.microfrontend) types.push(create.TYPE.MICROFRONTEND);
    if (options.library) types.push(create.TYPE.LIBRARY);
    if (options.app || types.length === 0) types.push(create.TYPE.APP);

    create(types, name, opts);
  });

program.parse(process.argv);
