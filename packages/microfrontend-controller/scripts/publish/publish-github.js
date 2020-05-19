const ghPages = require('gh-pages');
const { appPackageJson } = require('../utils/paths');
const { readJson } = require('../utils/fs');
const { explain } = require('../utils/log');

const publish = async () => {
  const packageJson = await readJson(appPackageJson);

  const escapePackageName = (packageName) => packageName.replace(/@/g, '').replace(/\//g, '_');

  const dest = `versions/${escapePackageName(appPackageJson.name)}/${appPackageJson.version}`;
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
};

module.exports = () => explain('Publishing build folder to github versions branch', publish);
