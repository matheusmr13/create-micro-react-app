
const { spawn } = require('child_process');

const exec = (command, {
  cwd,
  onStdout,
  onStderr,
  debug = true,
} = {}) => new Promise((resolve, reject) => {
  const spawnProcess = spawn(command, [], { shell: true, cwd });

  if (onStdout || debug) spawnProcess.stdout.on('data', onStdout || (data => process.stdout.write(data)));
  if (onStderr || debug) spawnProcess.stderr.on('data', onStderr || (data => process.stderr.write(data)));

  spawnProcess.on('exit', (code) => {
    if (code > 0) {
      reject(code);
      return;
    }
    resolve();
  });
});

const createExecutionContext = (rootAppPath, appName, opts) => {
  const execInFolder = path => command => exec(command, { ...opts, cwd: `${rootAppPath}${path || ''}` });
  return {
    execInRoot: execInFolder('/'),
    execInPackages: execInFolder('/packages'),
    execInApp: execInFolder(`/packages/${appName}`),
  };
};

const rmSync = (path, opts = { recursive: true }) => {
  const { recursive } = opts;
  exec(`[ -d ${path} ] || [ -f ${path} ] && rm ${recursive ? '-Rf' : ''} ${path}`);
};

module.exports = {
  exec,
  rmSync,
  createExecutionContext,
};
