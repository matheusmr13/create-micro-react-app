import { copyFolder, rm, mkdir, writeJson, getDirsFrom, getAllFilesFromDir } from './utils/fs';

const distFolder = 'build';
const microfrontendFolderName = 'microfrontends';
const allBuildsFolder = 'builds';

const escapePackageName = (packageName: string) => packageName.replace(/@/g, '').replace(/\//g, '_');

const mapMicrofrontend = async (microfrontends: any, rootFolder: string) => {
  const meta = await Promise.all(
    microfrontends.map(async (moduleName: string) => {
      const dir = `${rootFolder}/${allBuildsFolder}/${moduleName}`;
      const findResult = await getAllFilesFromDir(dir);

      const files = findResult
        .map((f: string) => f.replace(dir, ''))
        .filter((f: string) => !!f && f.indexOf('.') > -1)
        .reduce(
          (fileTypes: any, file: string) => {
            if (file.endsWith('.js')) {
              fileTypes.js.push(`./${microfrontendFolderName}/${moduleName}${file}`);
            } else if (file.endsWith('.css')) {
              fileTypes.css.push(`./${microfrontendFolderName}/${moduleName}${file}`);
            }
            return fileTypes;
          },
          { js: [], css: [] }
        );

      return {
        files,
        moduleName,
      };
    })
  );

  return meta.reduce((agg: any, microMeta: any) => Object.assign(agg, { [microMeta.moduleName]: microMeta.files }), {});
};

const packageAll = async (opts: any) => {
  const { webappName = 'webapp', rootFolder = '/tmp' } = opts;

  const escapedWebappPackageName = escapePackageName(webappName);
  await rm(`${rootFolder}/${distFolder}`);

  const allPackages = (await getDirsFrom(`${rootFolder}/${allBuildsFolder}`)).map(
    (folder) => folder.split('/').splice(-1, 1)[0]
  );
  const microfrontends = allPackages.filter((moduleName) => moduleName !== escapedWebappPackageName);

  await copyFolder(`${rootFolder}/${allBuildsFolder}/${escapedWebappPackageName}`, `${rootFolder}/${distFolder}`);

  await rm(`${rootFolder}/${distFolder}/service-worker.js`);

  await mkdir(`${rootFolder}/${distFolder}/${microfrontendFolderName}`);

  for (let i = 0; i < microfrontends.length; i++) {
    const actualPackage = microfrontends[i];

    await copyFolder(
      `${rootFolder}/${allBuildsFolder}/${actualPackage}`,
      `${rootFolder}/${distFolder}/${microfrontendFolderName}/${actualPackage}`
    );

    await Promise.all(
      [
        'asset-manifest.json',
        'index.html',
        'manifest.json',
        'precache-manifest*',
        'robots.txt',
        'service-worker.js',
        'deps.json',
      ].map(async (file) => {
        try {
          await rm(`${rootFolder}/${distFolder}/${microfrontendFolderName}/${actualPackage}/${file}`);
        } catch (error) {
          console.error(error);
        }
      })
    );
  }

  const metaMicrofrontend = await mapMicrofrontend(microfrontends, rootFolder);
  await writeJson(`${rootFolder}/${distFolder}/${microfrontendFolderName}/meta.json`, metaMicrofrontend);
};

export default packageAll;
