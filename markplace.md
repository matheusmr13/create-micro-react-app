# microfrontend-marketplace

# Setup your application

## Setup

1.  Create your repository on github
2.  `create-micro-react-app my-app -am`
3.  `cd my-app/packages/webapp`
4.  `npm run build`
5.  `microfrontend-marketplace publish`
6.  `cd ../microfrontend`
7.  `npm run build`
8.  `microfrontend-marketplace publish`

## Register your application

1. Login using github
2. Repositories -> Search for your repo -> Import -> packageName = webapp -> Import Button
3. Import New Microfrontend -> Search your repo again -> Import -> packageName = microfrontend -> Import Button
4. New deploy -> Choose versions -> deploy -> Go to `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`

# Features

- Manage application and microfrontends deploy with github integration

  - A simple application would cost nothing thanks for github free public repositories and gh-pages

- Create multiple versions of your application in one single site

  - Rollout your changes progressively using multiple applications at once

- All of this using `create-micro-react-app` and `micro-react`

  - Easy to use and maintain

# Configuration

`yarn add @cmra/node-app @cmra/webapp`

```
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
```
