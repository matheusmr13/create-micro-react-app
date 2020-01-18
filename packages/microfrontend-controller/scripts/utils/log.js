const ora = require('ora');

const explain = async (title, action) => {
  const spinner = ora(title).start();
  try {
    await action();
    spinner.succeed();
  } catch (e) {
    spinner.fail();
    console.error(e);
  }
};

module.exports = {
  explain,
};
