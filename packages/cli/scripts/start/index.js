const startProxyServer = require('./proxy-server');
const startLocalAll = require('./all');
const startSingle = require('./single');
const { writeJson } = require('../utils/fs');
const { resolveApp } = require('../utils/paths');
const { getMetaFromUrl } = require('./proxy');

const TYPE = {
  SINGLE: 'SINGLE',
  LOCAL: 'LOCAL',
  PROXY: 'PROXY',
};

const start = (type, opts) => {
  ({
    [TYPE.SINGLE]: startSingle,
    [TYPE.LOCAL]: () => {
      const { configurationFile } = opts;
      startLocalAll(configurationFile, opts);
    },
    [TYPE.PROXY]: async () => {
      const { url, isContainer } = opts;
      if (!isContainer) {
        startProxyServer(url);
      } else {
        const envJson = await getMetaFromUrl(url);
        await writeJson(resolveApp('public/microfrontends/meta.json'), envJson);
      }
      startSingle({ port: isContainer ? 3000 : 3001, isMicro: !isContainer });
    },
  }[type]());
};

start.TYPE = TYPE;

module.exports = start;
