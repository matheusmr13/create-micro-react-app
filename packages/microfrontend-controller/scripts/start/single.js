const { getReactAppRewiredPath, readJson } = require('../utils/fs');
const { exec } = require('../utils/process');
const { appPackageJson } = require('../utils/paths');

const REACT_APP = /^REACT_APP_/i;

const MICROFRONTEND_ENV = {
  REACT_APP_IS_MICROFRONTEND: true,
  BROWSER: 'none',
};

const WEBAPP_ENV = {
  REACT_APP_IS_CONTAINER: true,
};

const getEnvString = (packageJson) => {
  const envs = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce((env, key) => Object.assign(env, { [key]: process.env[key] }), {
      ...(process.env.IS_MICROFRONTEND ? MICROFRONTEND_ENV : WEBAPP_ENV),
      PORT: process.env.PORT || 3000,
      REACT_APP_PACKAGE_NAME: packageJson.name,
      SKIP_PREFLIGHT_CHECK: true,
    });

  return Object.keys(envs).map(env => `${env}=${envs[env]}`).join(' ');
};

const startSingle = async (opts = {}) => {
  const {
    isRunningAll,
  } = opts;

  let startou = false;

  if (isRunningAll) {
    const {
      pathToPackage,
      port,
      isMicro,
    } = opts;
    await exec(`PORT=${port} ${isMicro ? 'IS_MICROFRONTEND=true' : ''} npm run --prefix ${pathToPackage} start`, {
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
    });
  } else {
    const packageJson = await readJson(appPackageJson);
    const envString = getEnvString(packageJson);
    const reactAppRewiredPath = await getReactAppRewiredPath();
    await exec(`${envString} ${reactAppRewiredPath} start --config-overrides ${__dirname}/../../config/cra-webpack-config-override.js`, {
      onStdout: data => process.stdout.write(data),
    });
  }
};

module.exports = startSingle;
