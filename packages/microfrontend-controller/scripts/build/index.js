const buildAll = require('./all');
const buildLibrary = require('./library/create-lib');
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
    [TYPE.SINGLE]: () => {
      const { shouldBuildStandalone } = opts;
      buildSingle(shouldBuildStandalone);
    },
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
