const configJson = require('./config.json');

console.info('Running using confiigs:', JSON.stringify(configJson));
export const getGoogleCloudConfig = () => {
  return configJson.GOOGLE_CLOUD_PRIVATE_KEY
    ? {
        privateKey: configJson.GOOGLE_CLOUD_PRIVATE_KEY,
        clientEmail: configJson.GOOGLE_CLOUD_CLIENT_EMAIL,
      }
    : {
        keyFilename: './datastoreServiceAccount.json',
      };
};

export const getGithubConfig = () => {
  return {
    GITHUB_CLIENT_ID: configJson.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: configJson.GITHUB_CLIENT_SECRET,
  };
};
