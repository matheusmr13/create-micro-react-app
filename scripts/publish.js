#!/usr/bin/env node

const ghPages = require('gh-pages');
const { exec } = require('./utils');

require('dotenv').config({ path: '.env.local' });

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLOUD_PRIVATE_KEY, GOOGLE_CLOUD_CLIENT_EMAIL } = process.env;
const deployFrontend = async () => {
  try {
    await exec('npm run publish-gh-pages', { cwd: './docusaurus/website', debug: true });
    await exec(`REACT_APP_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID} npm run build`, {
      cwd: './packages/marketplace-frontend',
      debug: true,
    });

    await new Promise((resolve, reject) => {
      ghPages.publish(
        './packages/marketplace-frontend/build',
        {
          dest: 'app',
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
  } catch (e) {
    console.info(e);
  }
};

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

const run = async () => {
  // await deployFrontend();
  await deployBackend();
};

run();
