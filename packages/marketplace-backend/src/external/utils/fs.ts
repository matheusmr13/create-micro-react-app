import { promises as fs, existsSync, rmdirSync } from 'fs';
import path from 'path';

export default fs;

export const mkdir = (dir: string) => fs.mkdir(dir, { recursive: true });
export const isDirectory = async (source: string) => {
  const stat = await fs.stat(source);
  return stat.isDirectory();
};

export const copyFile = async (file: string, location: string) => {
  await fs.copyFile(file, location);
};

export const copyFolder = async (src: string, dest: string) => {
  try {
    await isDirectory(dest);
  } catch (e) {
    await mkdir(dest);
  }

  const files = await fs.readdir(src);

  return Promise.all(
    files.map(async (file) => {
      const srcFile = `${src}/${file}`;
      const destFile = `${dest}/${file}`;

      const isDir = await isDirectory(srcFile);
      if (isDir) {
        await copyFolder(srcFile, destFile);
      } else {
        await copyFile(srcFile, destFile);
      }
    })
  );
};

export const readJson = async (pathToFile: string) => {
  const data = await fs.readFile(pathToFile);
  return JSON.parse(data.toString());
};

export const writeFile = async (pathToFile: string, content: string) => {
  const dirname = path.dirname(pathToFile);
  await mkdir(dirname);
  await fs.writeFile(pathToFile, content);
};

export const writeJson = async (pathToFile: string, json: any) => writeFile(pathToFile, JSON.stringify(json, null, 2));

export const getDirsFrom = async (source: string) => {
  const paths = await fs.readdir(source);
  return paths.map((name) => path.join(source, name)).filter(isDirectory);
};

export const rm = async (pathTo: string) => {
  if (!existsSync(pathTo)) return Promise.resolve();

  try {
    return fs.rmdir(pathTo, { recursive: true });
  } catch (error) {
    return rmdirSync(pathTo, { recursive: true });
  }
};

export const getDirectories = async (source: string) => {
  const all = await fs.readdir(source);
  const mappedFolders = await Promise.all(
    all.map(async (fileOrFolder) => ({
      fileOrFolder,
      isDirectory: await isDirectory(path.join(source, fileOrFolder)),
    }))
  );

  return mappedFolders.filter(({ isDirectory: isDir }) => isDir).map(({ fileOrFolder: folder }) => folder);
};

export const mv = async (origin: string, dest: string) => fs.rename(origin, dest);
export const getAllFilesFromDir = async (dir: string, allFiles: any = []) => {
  const all = await fs.readdir(dir);

  await Promise.all(
    all.map(async (fileOrFolder) => {
      const fullDir = `${dir}/${fileOrFolder}`;
      const isDir = await isDirectory(fullDir);
      if (isDir) {
        await getAllFilesFromDir(fullDir, allFiles);
      } else {
        allFiles.push(fullDir);
      }
    })
  );
  return allFiles;
};
