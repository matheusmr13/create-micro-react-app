const proxy = require('express-http-proxy');
const express = require('express');
const axios = require('axios');
const { escapePackageName } = require('../utils/paths');


const { getAppFile } = require('../../utils/fs');

const packageJson = getAppFile('package.json');

const startProxyServer = (proxyUrl, opts) => {
  const app = express();
  const PORT = 3000;
  const escapedPackageName = escapePackageName(packageJson.name);

  const url = new URL(proxyUrl);
  const namespace = url.pathname;

  app.get(`${namespace}microfrontends/meta.json`, (_, res) => {
    axios.get(`${proxyUrl}microfrontends/meta.json`).then(response => response.data).then((json) => {
      res.json({
        ...json,
        [escapedPackageName]: { host: 'http://localhost:3001' },
      });
    });
  });

  app.use(namespace, proxy(proxyUrl, {
    proxyReqPathResolver: req => `${namespace}${req.url}`,
  }));

  app.use('/', proxy(url.origin));

  app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));
};

module.exports = startProxyServer;
