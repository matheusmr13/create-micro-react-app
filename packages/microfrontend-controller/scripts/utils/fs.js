const { promises: fs, existsSync, rmdirSync } = require('fs');
const path = require('path');

const mkdir = dir => fs.mkdir(dir, { recursive: true });
const isDirectory = async (source) => {
  const stat = await fs.stat(source);
  return stat.isDirectory();
};

const copyFile = async (file, location) => {
  await fs.copyFile(file, location);
};

const copyFolder = async (src, dest) => {
  try {
    await isDirectory(dest);
  } catch (e) {
    await mkdir(dest);
  }

  const files = await fs.readdir(src);

  return Promise.all(files.map(async (file) => {
    const srcFile = `${src}/${file}`;
    const destFile = `${dest}/${file}`;

    const isDir = await isDirectory(srcFile);
    if (isDir) {
      await copyFolder(srcFile, destFile);
    } else {
      await copyFile(srcFile, destFile);
    }
  }));
};

const readJson = async (pathToFile) => {
  const data = await fs.readFile(pathToFile);
  return JSON.parse(data);
};

const writeFile = async (pathToFile, content) => {
  const dirname = path.dirname(pathToFile);
  await mkdir(dirname);
  await fs.writeFile(pathToFile, content);
};

const writeJson = async (pathToFile, json) => writeFile(pathToFile, JSON.stringify(json, null, 2));

const copyTemplateTo = async (template, pathToFolder) => {
  await copyFolder(`${__dirname}/../../templates/${template}`, pathToFolder);
};

const getDirsFrom = async (source) => {
  const paths = await fs.readdir(source);
  return paths.map(name => path.join(source, name)).filter(isDirectory);
};

const getReactAppRewiredPath = async () => {
  const options = [
    `${__dirname}/../../../react-app-rewired/bin/index.js`,
    `${__dirname}/../../node_modules/react-app-rewired/bin/index.js`,
  ];

  const libInfos = await Promise.all(options.map(async option => ({
    option,
    exists: await (async () => {
      try {
        await fs.access(option);
        return true;
      } catch (e) {
        return false;
      }
    })(),
  })));

  return libInfos.find(lib => lib.exists).option;
};

const rm = async (pathTo) => {
  if (!existsSync(pathTo)) return Promise.resolve();

  try {
    return fs.rmdir(pathTo, { recursive: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return rmdirSync(pathTo, { recursive: true });
  }
};

const getDirectories = async (source) => {
  const all = await fs.readdir(source);
  const mappedFolders = await Promise.all(all.map(async fileOrFolder => ({
    fileOrFolder,
    isDirectory: await isDirectory(path.join(source, fileOrFolder)),
  })));

  return mappedFolders
    .filter(({ isDirectory: isDir }) => isDir)
    .map(({ fileOrFolder: folder }) => folder);
};

const getAllFilesFromDir = async (dir, allFiles = []) => {
  const all = await fs.readdir(dir);

  await Promise.all(all.map(async (fileOrFolder) => {
    const fullDir = `${dir}/${fileOrFolder}`;
    const isDir = await isDirectory(fullDir);
    if (isDir) {
      await getAllFilesFromDir(fullDir, allFiles);
    } else {
      allFiles.push(fullDir);
    }
  }));
  return allFiles;
};

module.exports = {
  mkdir,
  copyTemplateTo,
  writeJson,
  writeFile,
  readJson,
  getDirsFrom,
  getReactAppRewiredPath,
  getAllFilesFromDir,
  rm,
  copyFile,
  copyFolder,
  getDirectories,
  symlink: fs.symlink,
  isDirectory,
};
