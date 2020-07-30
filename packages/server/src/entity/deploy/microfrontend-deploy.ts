import { getTree, downloadTree, uploadTree } from '../../github/client';
import User from '../user';
import Version from '../version';

import Microfrontend, { TYPE } from '../microfrontend';
import { INTEGRATION_TYPE } from '../integration/types';
import AwsS3Integration from '../integration/aws-s3';
import { DeployPath, NamespaceDeployPath, MicrofrontendDeployPath } from './path';
import { getAllFilesFromDir, copyFolder, rm } from '../../external/utils/fs';
import Namespace from '../namespace';
import NamespaceDeploy from './namespace-deploy';
import ApplicationDeploy from './application-deploy';

export class MicrofrontendDeploy {
  static async mount(microfrontendId: string, versionId: string, opts: { path: NamespaceDeployPath }) {
    const microfrontend = await Microfrontend.findOne(microfrontendId);
    const version = await Version.findOne(versionId);
    return new MicrofrontendDeploy(microfrontend!, version!, {
      path: opts.path.getMicrofrontendDeployPath(microfrontend!, version!),
    });
  }

  path: MicrofrontendDeployPath;
  files?: {
    js: string[];
    css: string[];
  };

  allFilesPath?: string[];

  constructor(public microfrontend: Microfrontend, public version: Version, opts: { path: MicrofrontendDeployPath }) {
    this.path = opts.path;
  }

  async mountFiles() {
    const findResult = await getAllFilesFromDir(this.path.downloadDestination);

    this.allFilesPath = findResult.map((f: string) => f.replace(this.path.downloadDestination, ''));
    const files = this.allFilesPath
      .filter((f: string) => !!f && f.indexOf('.') > -1)
      .reduce(
        (fileTypes: any, file: string) => {
          if (file.endsWith('.js')) {
            fileTypes.js.push(this.path.toRelativeFile(file));
          } else if (file.endsWith('.css')) {
            fileTypes.css.push(this.path.toRelativeFile(file));
          }
          return fileTypes;
        },
        { js: [], css: [] }
      );
    this.files = files;
  }

  async removeFiles() {
    if (this.microfrontend.type === TYPE.MICROFRONTEND) {
      const FILES_TO_REMOVE = ['asset-manifest.json', 'precache-manifest*', 'service-worker.js', 'deps.json'];
      await rm(FILES_TO_REMOVE.map((file) => this.path.toDownloadDestinationFile(file)));
    }
  }

  async downloadArtifact(user: User) {
    const { originId, integrationType } = this.microfrontend;
    if (integrationType === INTEGRATION_TYPE.GITHUB) {
      const { sha } = this.version;
      const tree = await getTree(originId, sha, user);
      await downloadTree(this.path.downloadDestination, tree, user!);
    } else if (integrationType === INTEGRATION_TYPE.AWS_S3) {
      await AwsS3Integration.downloadArtifact(this.version.path, { path: this.path });
    }
    await this.removeFiles();
    await this.mountFiles();
  }

  async package(namespaceDeploy: NamespaceDeploy) {
    await copyFolder(this.path.downloadDestination, this.path.toNamespaceDistFolder(namespaceDeploy.path));
  }

  async upload(namespaceDeploy: NamespaceDeploy, applicationDeploy: ApplicationDeploy) {
    await Promise.all(
      this.allFilesPath!.map(async (file) => {
        const originPath = this.path.toNamespaceDistFolderFile(namespaceDeploy.path, file);
        const destPath = this.path.toBucketFile(namespaceDeploy.path, file);
        await AwsS3Integration.uploadFile({
          bucket: applicationDeploy.application.destinationId,
          origin: originPath,
          dest: destPath,
        });
      })
    );
  }
}

export default MicrofrontendDeploy;
