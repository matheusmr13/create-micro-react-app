const NodeApp = require('@cmra/server');
const Webapp = require('@cmra/webapp');

const configJson = require('./config.json');
/*
{
  "firebase": {
    ...config from firebase console...
  },
  "firebaseAdmin": {
    ...config from google cloud api console...
  },
  "database": {
    "host": "...",
    "port": "...",
    "username": "...",
    "password": "...",
    "database": "..."
  },
  "baseUrl": "http://localhost:8080/"
}
*/

if (!configJson) throw new Error('No config.json found');

const run = async () => {
  const destFolder = await Webapp.build({
    env: {
      FIREBASE_CONFIG_JSON: JSON.stringify(configJson.firebase),
      BASE_URL: configJson.baseUrl,
    },
  });
  NodeApp.withDatabase(configJson.database)
    .withFirebaseConfig(configJson.firebaseAdmin)
    .withStaticFiles(destFolder)
    .run(8080);
};

run();
