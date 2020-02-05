const buildAll = require('./all');
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
      const { shouldBuildStandalone, pathToSchema } = opts;
      buildSingle(shouldBuildStandalone, pathToSchema);
    },
    [TYPE.ALL]: () => buildAll(opts),
    [TYPE.PACKAGE]: () => packageAll(opts),
  }[type])();
};

start.TYPE = TYPE;

module.exports = start;
