const { escapePackageName } = require('./paths');

const REACT_APP = /^REACT_APP_/i;

const MICROFRONTEND_ENV = {
  BROWSER: 'none',
  IS_MICROFRONTEND: true
};

const WEBAPP_ENV = {
};

const getEnvString = ({ packageJson, isMicrofrontend }) => {
  const envs = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce((env, key) => Object.assign(env, { [key]: process.env[key] }), {
      ...(isMicrofrontend ? MICROFRONTEND_ENV : WEBAPP_ENV),
      PORT: process.env.PORT || 3000,
      REACT_APP_PACKAGE_NAME: escapePackageName(packageJson.name),
      SKIP_PREFLIGHT_CHECK: true,
    });

  return Object.keys(envs).map(env => `${env}=${envs[env]}`).join(' ');
};

module.exports = {
  getEnvString,
};
