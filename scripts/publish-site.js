#!/usr/bin/env node

const ghPages = require('gh-pages');
const { exec } = require('./utils');

// require('dotenv').config({ path: '.env.local' });

// const { GITHUB_CLIENT_ID } = process.env;
const deployFrontend = async () => {
  try {
    await exec('npm run build', { cwd: './packages/doc', debug: true });

    await new Promise((resolve, reject) => {
      ghPages.publish('./packages/doc/build', {}, (error) => {
        if (error) {
          console.error(error);
          reject(error);
          return;
        }
        resolve();
      });
    });
  } catch (e) {
    console.info(e);
  }
};

deployFrontend();
