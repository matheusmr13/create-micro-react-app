const dircompare = require('dir-compare');
const create = require('../scripts/create');
const { mkdir, rm } = require('../scripts/utils/fs');


const buildFolder = (testName, isOld) => `./test/__snapshots__/dist${isOld ? '' : '-new'}/${testName}`;

const testSnapshot = async (testName) => {
  const newFolder = buildFolder(testName);
  const oldFolder = buildFolder(testName, true);
  let result;
  try {
    result = await dircompare.compare(oldFolder, newFolder, {
      compareContent: true,
      excludeFilter: 'node_modules',
    });
  } catch (e) {
    throw new Error(`There is no snapshot created for "${testName}". Maybe you should check "${newFolder}" and, if it is right, copy to "${oldFolder}" in order to setup a new base snapshot`);
  }

  if (result.distinctFiles > 0) {
    throw new Error(`
        Test "${testName}" failed with ${result.distinctFiles} different files. Check diff with:

${result.diffSet
    .filter(diff => diff.state !== 'equal')
    .map(diff => `diff ${diff.path1}/${diff.name1} ${diff.path2}/${diff.name2}`)
    .join('\n\n')}
      `);
  }
};

describe('test', () => {
  beforeAll(async () => {
    await rm(buildFolder(''));
    await mkdir(buildFolder('', true));
    await mkdir(buildFolder(''));
  });
  it('should create app', async () => {
    const TEST_NAME = 'CREATE_APP';
    await create([create.TYPE.APP], buildFolder(TEST_NAME), {});
    await testSnapshot(TEST_NAME);
  });
  it('should create app', async () => {
    const TEST_NAME = 'CREATE_APP_WITH_MICRO';
    await create([create.TYPE.APP, create.TYPE.MICROFRONTEND], buildFolder(TEST_NAME), {});
    await testSnapshot(TEST_NAME);
  });
});
