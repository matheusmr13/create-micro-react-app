#!/usr/bin/env node

const dotEnv = require('dotenv');
const { exec } = require('./utils');

const { parsed: newEnvVars } = dotEnv.config({ path: '.env.development.local' });

const run = async () => {
  const envVars = Object.keys(newEnvVars).map((key) => `${key.toUpperCase()}='${newEnvVars[key]}'`);

  const backendEnv = envVars.join(' ');
  const frontendEnv = envVars.map((env) => `REACT_APP_${env}`).join(' ');

  exec(`${frontendEnv} REACT_APP_BASE_URL=http://localhost:8080 PORT=3333 npm start`, {
    cwd: './packages/webapp',
  });

  exec(`${backendEnv} npm run start:watch`, {
    cwd: './packages/my-nest-project',
  });
};

run();
