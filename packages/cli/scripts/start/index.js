const startProxyServer = require('./proxy-server');
const startLocalAll = require('./all');
const startSingle = require('./single');

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
    [TYPE.PROXY]: () => {
      const { url } = opts;
      startProxyServer(url);
      startSingle({ port: 3001, isMicro: true });
    },
  }[type]());
};

start.TYPE = TYPE;

module.exports = start;
