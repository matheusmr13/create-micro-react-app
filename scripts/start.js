#!/usr/bin/env node

const dotEnv = require('dotenv');
const { exec } = require('./utils');

const { parsed: newEnvVars } = dotEnv.config({ path: '.env.development.local' });

const run = async () => {
  await exec(`echo '${JSON.stringify(newEnvVars, null, 2)}' > config.json`, {
    cwd: './packages/marketplace-backend/dist/src',
  });

  const envVars = Object.keys(newEnvVars)
    .map((key) => `REACT_APP_${key}='${newEnvVars[key]}'`)
    .join(' ');

  exec(`${envVars} PORT=3333 npm start`, {
    cwd: './packages/marketplace-frontend',
  });

  exec('npm run start:watch', {
    cwd: './packages/marketplace-backend',
  });
};

run();
