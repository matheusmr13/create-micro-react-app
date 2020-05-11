import chalk from 'chalk';
import ghPages from 'gh-pages';
import { appPackageJson as appPackageJsonPath } from './path';

const { log } = console;

const publish = async (options: any) => {
  log(chalk.blue('Publishing on github!'));
  const appPackageJson = require(appPackageJsonPath);

  const escapePackageName = (packageName: string) => packageName.replace(/@/g, '').replace(/\//g, '_');

  const dest = `versions/${escapePackageName(appPackageJson.name)}/${appPackageJson.version}`;
  console.info({ dest });
  await new Promise((resolve, reject) => {
    ghPages.publish(
      'build',
      {
        dest,
        branch: 'versions',
      },
      (error) => {
        if (error) {
          console.error(error);
          reject(error);
          return;
        }
        resolve();
      }
    );
  });
  log(chalk.blue('Done!'));
};

export default publish;
