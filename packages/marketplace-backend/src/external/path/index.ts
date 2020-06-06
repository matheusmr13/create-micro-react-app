import Namespace from '../../entity/namespace';
import { MicroVersion } from '../../entity/compiled-deploy';
import Microfrontend, { TYPE } from '../../entity/microfrontend';
import Version from '../../entity/version';

const DEFAULT_PATHS = {
  DIST: 'build',
  MICROFRONTEND_FOLDER: 'microfrontends',
  MICRO_VERSIONS_FOLDER: 'microfrontends',
  NAMESPACE_FOLDER: 'v',
  META_JSON: 'meta.json',
};

const escapePackageName = (packageName: string) => packageName.replace(/@/g, '').replace(/\//g, '_');

export class PathToNamespace {
  constructor(private rootFolder: string, private namespace: Namespace) {}

  root = () =>
    `${this.rootFolder}${
      this.namespace.isMain ? '' : `/${DEFAULT_PATHS.NAMESPACE_FOLDER}/${this.namespace.path.replace(/\//g, '')}`
    }`;
  microfrontendsFolder = () => `${this.root()}/${DEFAULT_PATHS.MICROFRONTEND_FOLDER}`;
  microfrontendFolder = (microfrontend: Microfrontend) =>
    `${this.root()}${
      microfrontend.type === TYPE.CONTAINER ? '' : `/${DEFAULT_PATHS.MICROFRONTEND_FOLDER}/${microfrontend.packageName}`
    }`;
  microfrontendsMetaJson = () => `${this.microfrontendsFolder()}/${DEFAULT_PATHS.META_JSON}`;
}

export class PathTo {
  static microfrontendFile = (microfrontend: Microfrontend, file: string) =>
    `./${DEFAULT_PATHS.MICROFRONTEND_FOLDER}/${microfrontend.packageName}${file}`;

  rootFolder: string;
  constructor(rootFolder: string) {
    this.rootFolder = rootFolder;
  }

  distFolder = () => `${this.rootFolder}/${DEFAULT_PATHS.DIST}`;
  namespaceMetaJson = () => `${this.distFolder()}/${DEFAULT_PATHS.NAMESPACE_FOLDER}/${DEFAULT_PATHS.META_JSON}`;
  microVersionsFolder = () => `${this.rootFolder}/${DEFAULT_PATHS.MICRO_VERSIONS_FOLDER}`;

  withNamespace = (namespace: Namespace) => new PathToNamespace(this.distFolder(), namespace);
  microVersion = (microVersion: MicroVersion) =>
    `${this.microVersionsFolder()}/${microVersion.microfrontend.packageName}/${microVersion.version.name}`;
}
