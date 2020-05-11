import fs, { copyFolder, rm, mkdir, writeJson, getDirsFrom, getAllFilesFromDir } from './utils/fs';

const getTreeFromFolder = async (folder: string) => {
  const a = await getAllFilesFromDir(folder);
  console.info(a);
  const tree = await Promise.all(
    a.map(async (filePath: string) => {
      const content = await fs.readFile(filePath);

      return {
        path: filePath.replace(`${folder}/`, ''),
        mode: '100644',
        type: 'blob',
        content: content.toString(),
      };
    })
  );
  return tree;
};

export default getTreeFromFolder;
