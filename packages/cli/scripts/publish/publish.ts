import chalk from 'chalk';
import { spawn } from 'child_process';
import { writeJson, mkdir, mv, copyFolder, rm } from './fs';
import axios from 'axios';

import { appPackageJson as appPackageJsonPath, resolveApp } from './path';
const { log } = console;

const exec = (
  command: any,
  {
    cwd,
    onStdout,
    onStderr,
    debug = true,
  }: {
    cwd?: any;
    onStdout?: any;
    onStderr?: any;
    debug?: boolean;
  } = {}
) =>
  new Promise((resolve, reject) => {
    const spawnProcess = spawn(command, [], { shell: true, cwd });

    if (onStdout || debug) spawnProcess.stdout.on('data', onStdout || ((data) => process.stdout.write(data)));
    if (onStderr || debug) spawnProcess.stderr.on('data', onStderr || ((data) => process.stderr.write(data)));

    spawnProcess.on('exit', (code) => {
      if (code && code > 0) {
        reject(code);
        return;
      }
      resolve();
    });
  });

const mountPackageJson = (packageJson: { name: string; version: string; author: any; license: string }) => ({
  name: `${packageJson.name}-microfrontend`,
  version: packageJson.version,
  author: packageJson.author ? JSON.stringify(packageJson.author) : '',
  files: ['build'],
});

const publish = async (options: any) => {
  log(chalk.blue('Publasdishing'));
  const appPackageJson = require(appPackageJsonPath);

  const publishFolder = resolveApp('publish');
  const buildFolder = resolveApp('build');
  await mkdir(publishFolder);
  await writeJson(`${publishFolder}/package.json`, mountPackageJson(appPackageJson));
  try {
    await copyFolder(buildFolder, `${publishFolder}/build`);
  } catch (e) {
    log(chalk.red('You need to build your project to ./build folder before publishing'));
    return;
  }
  await exec('npm publish', { cwd: publishFolder });
  log(chalk.blue('done'));
  await rm(publishFolder);

  // await axios({
  // 	url: 'http://localhost:8080'
  // })
};

export default publish;
