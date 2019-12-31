
const { spawn } = require('child_process');

const exec = (command, {
  cwd,
  onStdout,
  onStderr,
} = {}) => new Promise((resolve, reject) => {
  const spawnProcess = spawn(command, [], { shell: true, cwd });

  if (onStdout) spawnProcess.stdout.on('data', onStdout);
  if (onStderr) spawnProcess.stderr.on('data', onStderr);

  spawnProcess.on('exit', (code) => {
    if (code > 0) {
      reject(code);
      return;
    }
    resolve();
  });
});

const createExecutionContext = (rootAppPath, appName) => {
  const execInFolder = path => command => exec(command, { cwd: `${rootAppPath}${path || ''}` });
  return {
    execInRoot: execInFolder('/'),
    execInPackages: execInFolder('/packages'),
    execInApp: execInFolder(`/packages/${appName}`),
  };
};

module.exports = {
  exec,
  createExecutionContext,
};
