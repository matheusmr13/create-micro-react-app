---
id: setup-environment
title: Setup environment
---

To setup a backoffice instance inside your infrastructure, just create a npm project and install our server + webapp.

```bash
  npm init -y
  npm i @cmra/server
  npm i @cmra/webapp
```

and then define your index.js

```js
const NodeApp = require('@cmra/server');
const Webapp = require('@cmra/webapp');

const configJson = {
  firebase: {
    /* your firebase client configs */
  },
  firebaseAdmin: {
    /* your firebase admin configs from google cloud services */
  },
  database: {
    /* your database config */
  },
};

const run = async () => {
  const destFolder = `${__dirname}/node_modules/@cmra/webapp/build`;

  await Webapp.build({
    env: {
      FIREBASE_CONFIG: JSON.stringify(firebaseConfig),
      BASE_URL: '',
    },
  });

  NodeApp.withDatabase(configJson.database)
    .withFirebaseConfig({
      ...configJson.firebaseAdmin,
      private_key: JSON.parse(`"${configJson.firebaseAdmin.private_key}"`),
    })
    .withStaticFiles(destFolder)
    .run(8080);
};

run();
```
