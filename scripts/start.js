#!/usr/bin/env node

const { exec } = require('./utils');
require('dotenv').config({ path: '.env.development.local' });

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLOUD_CLIENT_EMAIL,
  GOOGLE_CLOUD_PRIVATE_KEY,
  GOOGLE_APPLICATION_CREDENTIALS,
} = process.env;

const run = async () => {
  const configJson = {
    GOOGLE_CLOUD_CLIENT_EMAIL,
    GOOGLE_CLOUD_PRIVATE_KEY: (JSON.stringify(GOOGLE_CLOUD_PRIVATE_KEY) || '').replace(/"/g, ''),
    GITHUB_CLIENT_SECRET,
    GITHUB_CLIENT_ID,
    GOOGLE_APPLICATION_CREDENTIALS,
  };
  await exec(`echo '${JSON.stringify(configJson, null, 2)}' > config.json`, {
    cwd: './packages/marketplace-backend/dist',
  });

  exec(`REACT_APP_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID} npm start`, { cwd: './packages/marketplace-frontend' });

  exec('$(gcloud beta emulators datastore env-init) && npm run start:watch', {
    cwd: './packages/marketplace-backend',
  });
  exec('gcloud beta emulators datastore start');
};

run();
