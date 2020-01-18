const buildAll = require('./all');
const buildLibrary = require('./library');
const packageAll = require('./package');
const buildSingle = require('./single');

const TYPE = {
  SINGLE: 'SINGLE',
  ALL: 'ALL',
  LIBRARY: 'LIBRARY',
  PACKAGE: 'PACKAGE',
};

const start = (type, opts) => {
  ({
    [TYPE.SINGLE]: () => buildSingle(),
    [TYPE.LIBRARY]: () => {
      const { pathToSchema } = opts;
      buildLibrary(pathToSchema);
    },
    [TYPE.ALL]: () => buildAll(opts),
    [TYPE.PACKAGE]: () => packageAll(opts),
  }[type])();
};

start.TYPE = TYPE;

module.exports = start;
