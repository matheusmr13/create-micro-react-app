const { resolveApp } = require('../utils/fs');
const { promiseExec } = require('../utils/process');

const indexLib = resolveApp('src/index-lib.ts');
const dist = resolveApp('dist');

const build = async () => {
	await promiseExec(`tsc ${indexLib} --outDir ${dist} --experimentalDecorators`);
}

module.exports = build;