const { getReactAppRewiredPath, readJson } = require('../utils/fs');
const { exec } = require('../utils/process');
const { appPackageJson } = require('../utils/paths');
const { getEnvString } = require('../utils/env');

const startSingle = async (opts = {}) => {
  const {
    isRunningAll,
    port,
    isMicro,
  } = opts;

  let startou = false;

  if (isRunningAll) {
    const {
      pathToPackage,
    } = opts;
    const envString = getEnvString({ isMicrofrontend: isMicro, port });

    await exec(`${envString} npm run --prefix ${pathToPackage} start`, {
      onStdout: (data) => {
        if (data.toString().indexOf('Starting the development server') > -1) {
          console.info(`Startando ${pathToPackage}`);
        } else if (data.toString().indexOf('Compiled') > -1) {
          console.info(`Startou ${pathToPackage}`);
          startou = true;
        }

        if (startou) {
          console.info(`[LOG FROM ${pathToPackage}]`);
          console.info(data.toString());
        }
      },
      onStderr: data => process.stderr.write(data),
    });
  } else {
    const packageJson = await readJson(appPackageJson);
    const envString = getEnvString({ packageJson, isMicrofrontend: process.env.IS_MICROFRONTEND || isMicro, port });
    const reactAppRewiredPath = await getReactAppRewiredPath();
    await exec(`${envString} ${reactAppRewiredPath} start --config-overrides ${__dirname}/../../config/cra-webpack-config-override.js`, {
      onStdout: data => process.stdout.write(data),
      onStderr: data => process.stderr.write(data),
    });
  }
};

module.exports = startSingle;
