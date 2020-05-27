#!/usr/bin/env node

const { exec } = require('./utils');

require('dotenv').config({ path: '.env.local' });

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLOUD_PRIVATE_KEY, GOOGLE_CLOUD_CLIENT_EMAIL } = process.env;

const deployBackend = async () => {
  const configJson = {
    GOOGLE_CLOUD_CLIENT_EMAIL,
    GOOGLE_CLOUD_PRIVATE_KEY: JSON.stringify(GOOGLE_CLOUD_PRIVATE_KEY).replace(/"/g, ''),
    GITHUB_CLIENT_SECRET,
    GITHUB_CLIENT_ID,
  };
  await exec(`echo '${JSON.stringify(configJson, null, 2)}' > config.json`, {
    cwd: './packages/marketplace-backend/dist',
  });

  await exec('npm run deploy', {
    cwd: './packages/marketplace-backend',
  });
};

deployBackend();
