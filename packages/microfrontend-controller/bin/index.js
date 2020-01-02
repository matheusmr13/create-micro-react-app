#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const packageJson = require('./../package.json');

const create = require('../scripts/create');
const start = require('../scripts/start');
const build = require('../scripts/build');

program
  .name(Object.keys(packageJson.bin)[0])
  .version(packageJson.version);

program
  .command('start')
  .description(chalk.bold.green('Start your application'))
  .option('-c, --configuration-file <configuration_file>', '')
  .option('-p, --proxy <url>', '')
  .option('-a, --all <webapp_package_name>', '')
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
  .description('build your application')
  .option('-l, --library [library_path]', 'lib')
  .option('-p, --package', 'package')
  .option('-a, --all <webapp_package_name>', 'mode')
  .option('-c, --configuration-file <configuration_file>', '')
  .option('-m, --microfrontend', 'microfrontend')
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
      type = build.TYPE.LIBRARY;
      opts.pathToSchema = options.library;
    } else if (options.package) {
      type = build.TYPE.PACKAGE;
    }

    build(type, opts);
  });

program
  .command('create <name> [pathToFolder]')
  .description('create your application')
  .option('-l, --library', 'lib')
  .option('-a, --app', 'application')
  .option('-m, --microfrontend', 'application')
  .option('-t, --template', 'create react app template')
  .action((name, pathToFolder, options) => {
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
