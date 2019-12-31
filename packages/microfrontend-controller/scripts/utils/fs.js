const fs = require('fs').promises;
const path = require('path');

const mkdir = dir => fs.mkdir(dir, { recursive: true });
const isDirectory = async (source) => {
  const stat = await fs.stat(source);
  return stat.isDirectory();
};

const copyFile = async (file, location) => {
  await fs.copyFile(file, location);
};

const mergeDirs = async (src, dest) => {
  const files = await fs.readdir(src);

  return Promise.all(files.map(file => async (resolve) => {
    const srcFile = `${src}/${file}`;
    const destFile = `${dest}/${file}`;

    const isDir = await isDirectory(srcFile);
    if (isDir) {
      await mergeDirs(srcFile, destFile);
    } else {
      await copyFile(destFile, srcFile);
    }

    resolve();
  }));
};

const readJson = async (pathToFile) => {
  const data = await fs.readFile(pathToFile);
  return JSON.parse(data);
};

const writeJson = async (pathToFile, json) => {
  await fs.writeFile(pathToFile, JSON.stringify(json, null, 2));
};

const copyTemplateTo = async (template, pathToFolder) => {
  await mergeDirs(`${__dirname}/../../templates/${template}`, pathToFolder);
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

module.exports = {
  mkdir,
  copyTemplateTo,
  writeJson,
  readJson,
  getDirsFrom,
  getReactAppRewiredPath,
};
