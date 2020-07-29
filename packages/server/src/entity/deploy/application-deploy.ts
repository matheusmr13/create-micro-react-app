import User from '../user-extra';
import Application from '../application';
import Namespace from '../namespace';

import MicrofrontendDeploy from './microfrontend-deploy';
import NamespaceDeploy from './namespace-deploy';
import { rm, writeJson } from '../../external/utils/fs';
import { DeployPath } from './path';
import { INTEGRATION_TYPE } from '../integration/types';
import getTreeFromFolder from '../../external/list-folder';
import { uploadTree } from '../../github/client';
import AwsS3Integration from '../integration/aws-s3';

type MicrofrontendDeployMap = { [key: string]: MicrofrontendDeploy };
type NamespaceDeployMap = { [key: string]: NamespaceDeploy };

class ApplicationDeploy {
  private microfrontendDeploys: MicrofrontendDeployMap = {};
  private namespaceDeploys: NamespaceDeployMap = {};
  private path: DeployPath;

  constructor(public application: Application, private user: User) {
    this.path = DeployPath.generate(this.application.id!);
  }

  debug(str: string) {
    console.log(`[DEPLOY ${this.application.id}] ${str}`);
  }

  getNamespaceMetaJson() {
    return Object.values(this.namespaceDeploys).reduce(
      (agg, { namespace: { path, isMain }, deploy }) =>
        Object.assign(agg, { [isMain ? 'main' : path.replace(/\//g, '')]: deploy!.id }),
      {}
    );
  }

  async mount() {
    const namespaces = await Namespace.createQueryBuilder()
      .where(`Namespace.applicationId = :id`)
      .setParameter('id', this.application.id)
      .getMany();

    if (!namespaces.length) {
      return;
    }

    for (let i = 0; i < namespaces.length; i++) {
      const namespace = namespaces[i];
      const namespaceDeploy = new NamespaceDeploy(namespace, { path: this.path.getNamespaceDeployPath(namespace) });
      this.namespaceDeploys[namespace.id] = namespaceDeploy;

      this.microfrontendDeploys = await namespaceDeploy.mount(this.microfrontendDeploys);
    }
  }

  async downloadAll() {
    await Promise.all(
      Object.values(this.microfrontendDeploys).map(async (microfrontendDeploy) => {
        await microfrontendDeploy.downloadArtifact(this.user);
      })
    );
  }

  async packageAll() {
    await Promise.all(
      Object.values(this.namespaceDeploys).map(async (namespaceDeploy) => {
        await namespaceDeploy.package();
      })
    );
    await writeJson(this.path.namespaceMetaJson, this.getNamespaceMetaJson());
  }

  async uploadAll() {
    if (this.application.integrationType === INTEGRATION_TYPE.GITHUB) {
      const tree = await getTreeFromFolder(this.path.finalDistFolder);
      await uploadTree(this.application.destinationId, tree, this.user, 'my versiion');
    } else if (this.application.integrationType === INTEGRATION_TYPE.AWS_S3) {
      await Promise.all(
        Object.values(this.namespaceDeploys).map(async (namespaceDeploy) => {
          await namespaceDeploy.upload(this);
        })
      );

      await AwsS3Integration.uploadFile({
        bucket: this.application.destinationId,
        origin: this.path.namespaceMetaJson,
        dest: this.path.namespaceBucketMetaJson,
      });
    } else {
      throw new Error(`Integration ${this.application.integrationType} not supported!`);
    }
  }

  async cleanUp() {
    await rm(this.path.rootFolder);
  }

  async execute() {
    try {
      this.debug('starting');
      await this.mount();
      this.debug('downloading');
      await this.downloadAll();
      this.debug('packaging');
      await this.packageAll();
      this.debug('uploading');
      await this.uploadAll();
      this.debug('cleaning up');
      await this.cleanUp();
    } catch (e) {
      this.debug('deu ruim');
      console.error(e);
      await this.cleanUp();
    }
  }
}

export default ApplicationDeploy;
