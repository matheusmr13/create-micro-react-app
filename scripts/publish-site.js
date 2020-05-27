#!/usr/bin/env node

const ghPages = require('gh-pages');
const { exec } = require('./utils');

require('dotenv').config({ path: '.env.local' });

const { GITHUB_CLIENT_ID } = process.env;
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

deployFrontend();
