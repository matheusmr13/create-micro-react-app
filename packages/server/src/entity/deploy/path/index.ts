import Namespace from '../../namespace';
import NamespaceDeploy from '../namespace-deploy';
import Microfrontend, { TYPE } from '../../microfrontend';
import Version from '../../version';
import path from 'path';

const DEFAULT_PATHS = {
  DIST: 'dist',
  RELATIVE_PATH: '.',
  TMP: '/tmp',
  MICROFRONTEND_FOLDER: 'microfrontends',
  MICROFRONTEND_ARTIFACTS: 'artifacts',
  MICROFRONTEND_DOWNLOADS: 'downloads',
  MICROFRONTEND_META_JSON: 'meta.json',
  NAMESPACE_FOLDER: 'v',
  NAMESPACE_META_JSON: 'meta.json',
};

const c = (...args: string[]) => path.join(...args);
const relative = (path: string) => `./${path}`;
export class NamespaceDeployPath {
  public microfrontendFolder: string;
  public microfrontendMetaJson: string;
  public microfrontendBucketMetaJson: string;
  public rootFolder: string;

  constructor(public deployPath: DeployPath, public namespace: Namespace) {
    if (namespace.isMain) {
      this.rootFolder = c(deployPath.finalDistFolder);
    } else {
      this.rootFolder = c(deployPath.finalDistFolder, DEFAULT_PATHS.NAMESPACE_FOLDER, this.namespace.path);
    }
    this.microfrontendFolder = c(this.rootFolder, DEFAULT_PATHS.MICROFRONTEND_FOLDER);
    this.microfrontendMetaJson = c(this.microfrontendFolder, DEFAULT_PATHS.MICROFRONTEND_META_JSON);
    this.microfrontendBucketMetaJson = this.microfrontendMetaJson.replace(`${deployPath.finalDistFolder}/`, '');
  }

  getMicrofrontendDeployPath(microfrontend: Microfrontend, version: Version) {
    return new MicrofrontendDeployPath(this.deployPath, microfrontend, version);
  }
}

export class MicrofrontendDeployPath {
  downloadDestination: string;
  temp: string;

  constructor(public deployPath: DeployPath, public microfrontend: Microfrontend, public version: Version) {
    const { rootFolder } = this.deployPath;
    this.downloadDestination = c(
      rootFolder,
      DEFAULT_PATHS.MICROFRONTEND_ARTIFACTS,
      microfrontend.packageName,
      version.name
    );

    this.temp = c(rootFolder, DEFAULT_PATHS.MICROFRONTEND_DOWNLOADS, microfrontend.packageName, version.name);
  }

  toDownloadDestinationFile(file: string) {
    return c(this.downloadDestination, file);
  }

  toRelativeFile(file: string): any {
    return relative(c(DEFAULT_PATHS.MICROFRONTEND_FOLDER, this.microfrontend.packageName, file));
  }

  toNamespaceDistFolder(namespaceDeployPath: NamespaceDeployPath) {
    if (this.microfrontend.type === TYPE.CONTAINER) {
      return this.toContainerDistFolder(namespaceDeployPath);
    }
    if (this.microfrontend.type === TYPE.MICROFRONTEND) {
      return this.toMicrofrontendDistFolder(namespaceDeployPath);
    }
    throw new Error('Type not mapped');
  }

  toNamespaceDistFolderFile(namespaceDeployPath: NamespaceDeployPath, file: string) {
    return c(this.toNamespaceDistFolder(namespaceDeployPath), file);
  }

  toBucketFile(namespaceDeployPath: NamespaceDeployPath, file: string) {
    return c(this.toNamespaceDistFolder(namespaceDeployPath), file).replace(`${this.deployPath.finalDistFolder}/`, '');
  }

  toMicrofrontendDistFolder(namespaceDeployPath: NamespaceDeployPath) {
    return c(namespaceDeployPath.microfrontendFolder, this.microfrontend.packageName);
  }

  toContainerDistFolder(namespaceDeployPath: NamespaceDeployPath): string {
    return namespaceDeployPath.rootFolder;
  }
}

export class DeployPath {
  static generate(id: string) {
    return new DeployPath(c(DEFAULT_PATHS.TMP, id));
  }

  namespaceMetaJson: string;
  namespaceBucketMetaJson: string;
  finalDistFolder: string;
  constructor(public rootFolder: string) {
    this.finalDistFolder = c(rootFolder, DEFAULT_PATHS.DIST);
    this.namespaceMetaJson = c(this.finalDistFolder, DEFAULT_PATHS.NAMESPACE_FOLDER, DEFAULT_PATHS.NAMESPACE_META_JSON);
    this.namespaceBucketMetaJson = this.namespaceMetaJson.replace(`${this.finalDistFolder}/`, '');
  }

  getNamespaceDeployPath(namespace: Namespace) {
    return new NamespaceDeployPath(this, namespace);
  }
}
