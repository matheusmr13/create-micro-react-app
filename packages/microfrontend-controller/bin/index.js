#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const packageJson = require('./../package.json');

program
  .name(Object.keys(packageJson.bin)[0])
  .version(packageJson.version);

program
  .command('start')
  .description(chalk.bold.green('Start your application'))
  .option('-f, --configuration-file <configuration_file>', '')
  .option('-p, --proxy <url>', '')
  .option('-l, --local <webapp_package_name>', '')
  .action((options) => {
    const startApp = require('../scripts/start');

    const opts = {};
    let type = startApp.TYPE.SINGLE;
    if (options.configurationFile) {
      type = startApp.TYPE.LOCAL;
      opts.configurationFile = options.configurationFile;
    } else if (options.proxy) {
      type = startApp.TYPE.PROXY;
      opts.url = options.proxy;
    } else if (options.local) {
      type = startApp.TYPE.LOCAL;
      opts.webappName = options.local;
    }

    startApp(type, opts);

    return;
    console.info('locaaaal', options);
    if (options.proxy) {
      require('../scripts/start-mock')(options.proxy);
    } else if (options.configurationFile || options.local) {
      require('../scripts/start-with-repo')();
    } else {
      require('../scripts/start')();
    }
  });

program
  .command('build')
  .description('build your application')
  .option('-l, --library <library_path>', 'lib')
  .option('-a, --all', 'mode')
  .action((options) => {
    if (options.all) {
      require('../scripts/build-all')();
    } else if (options.library) {
      require('../scripts/build-lib')(options.library);
    } else {
      require('../scripts/build')();
    }
  });

program
  .command('create <name> [pathToFolder]')
  .description('create your application')
  .option('-l, --library', 'lib')
  .option('-a, --app', 'application')
  .option('-m, --microfrontend', 'application')
  .option('-t, --template', 'create react app template')
  .action((name, pathToFolder, options) => {
    const CreateApp = require('../scripts/create');

    const opts = {
      template: options.template,
    };

    const types = [];
    if (options.microfrontend) types.push(CreateApp.TYPE.MICROFRONTEND);
    if (options.library) types.push(CreateApp.TYPE.LIBRARY);
    if (options.app || types.length === 0) types.push(CreateApp.TYPE.APP);

    CreateApp.create(types, name, opts);

    return;
    if (options.app) {
      require('../scripts/create-app')(name, opts);
    } else if (options.microfrontend) {
      require('../scripts/create-microfrontend')(name, pathToFolder, opts);
    } else if (options.library) {
      console.info('not implemented yet');
    }
  });

program.parse(process.argv);
