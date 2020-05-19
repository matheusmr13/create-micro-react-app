import { copyFolder, rm, mkdir, writeJson, getDirsFrom, getAllFilesFromDir } from './utils/fs';
import Namespace from 'namespace/model';
import Deploy from 'deploy/state';
import CompiledDeploy, { MicroVersion } from 'deploy/model';
import Microfrontend, { TYPE } from 'microfrontend/model';
import Version from 'version/model';

import { PathToNamespace, PathTo } from './path';

const FILES_TO_REMOVE = [
  'asset-manifest.json',
  'manifest.json',
  'precache-manifest*',
  'service-worker.js',
  'deps.json',
];

const mapMicrofrontend = async (pathToNamespace: PathToNamespace, microfrontends: MicroVersion[]) => {
  const meta = await Promise.all(
    microfrontends.map(async ({ microfrontend, version }) => {
      const dir = pathToNamespace.microfrontendFolder(microfrontend);
      const findResult = await getAllFilesFromDir(dir);
      const files = findResult
        .map((f: string) => f.replace(dir, ''))
        .filter((f: string) => !!f && f.indexOf('.') > -1)
        .reduce(
          (fileTypes: any, file: string) => {
            if (file.endsWith('.js')) {
              fileTypes.js.push(PathTo.microfrontendFile(microfrontend, file));
            } else if (file.endsWith('.css')) {
              fileTypes.css.push(PathTo.microfrontendFile(microfrontend, file));
            }
            return fileTypes;
          },
          { js: [], css: [] }
        );

      return {
        files,
        moduleName: microfrontend.packageName,
      };
    })
  );

  return meta.reduce((agg: any, microMeta: any) => Object.assign(agg, { [microMeta.moduleName]: microMeta.files }), {});
};

const processMicroVersion = async (pathTo: PathTo, pathToNamespace: PathToNamespace, microVersion: MicroVersion) => {
  const { microfrontend } = microVersion;

  const microfrontendFolder = pathToNamespace.microfrontendFolder(microfrontend);
  await copyFolder(pathTo.microVersion(microVersion), microfrontendFolder);
  await rm(FILES_TO_REMOVE.map((file) => `${microfrontendFolder}/${file}`));
};

const processCompiledDeploy = async (pathTo: PathTo, compiledDeploy: CompiledDeploy) => {
  const { namespace, versionsByMicrofrontend } = compiledDeploy;
  const pathToNamespace = pathTo.withNamespace(namespace);
  const webapp = versionsByMicrofrontend.find(({ microfrontend }) => microfrontend.type === TYPE.CONTAINER)!;
  await processMicroVersion(pathTo, pathToNamespace, webapp);

  const microfrontends = versionsByMicrofrontend.filter(
    ({ microfrontend }) => microfrontend.type === TYPE.MICROFRONTEND
  );
  for (let i = 0; i < microfrontends.length; i++) {
    await processMicroVersion(pathTo, pathToNamespace, microfrontends[i]);
  }

  const metaMicrofrontend = await mapMicrofrontend(pathToNamespace, microfrontends);
  await writeJson(pathToNamespace.microfrontendsMetaJson(), metaMicrofrontend);
};

const packageAll = async (opts: { webappName?: string; rootFolder?: string; deploysToDo: CompiledDeploy[] }) => {
  const { rootFolder = '/tmp', deploysToDo } = opts;

  const pathTo = new PathTo(rootFolder);
  await rm(pathTo.distFolder());

  await Promise.all(deploysToDo.map(async (compiledDeploy) => processCompiledDeploy(pathTo, compiledDeploy)));

  await writeJson(
    pathTo.namespaceMetaJson(),
    deploysToDo.reduce(
      (agg, { namespace: { path, isMain }, deploy }) =>
        Object.assign(agg, { [isMain ? 'main' : path.replace(/\//g, '')]: deploy.id }),
      {}
    )
  );
};

export default packageAll;
