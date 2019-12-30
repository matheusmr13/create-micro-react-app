#!/usr/bin/env node

const packageJson = require('./../package.json');
const chalk = require('chalk');
const program = require('commander');

program
  .name(Object.keys(packageJson.bin)[0])
  .version(packageJson.version)

program
  .command('start')
  .description(chalk.bold.green('Start your application'))
  .option('-f, --configuration-file <configuration_file>', `
  Specify a file that has all microfrontend paths to start. All applications will run on development mode with hotreload.

  Example:

    {
      "microfrontends": {
        "first-microfrontend": "/path/to/first/microfrontend/project"
        "second-microfrontend": "/path/to/second/microfrontend/project"
      },
      "app": "/path/to/project/container"
    }
  `)
  .option('-p, --proxy <url>', ``)
  .action((options) => {
    if (options.proxy) {
      require('../scripts/start-mock')(options.proxy);
    } else if (options.configurationFile) {
      require('../scripts/start-with-repo')();
    } else {
      require('../scripts/start')()
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
  .action((name, pathToFolder, options) => {
    if (options.app) {
      require('../scripts/create-app')(name);
    } else if (options.microfrontend) {
      require('../scripts/create-microfrontend')(name, pathToFolder);
    } else if (options.library) {
      console.info('not implemented yet');
    }
  });

program.parse(process.argv);
