import { getTree, downloadTree, uploadTree } from '../github/client';
import User from '../entity/user-extra';
import Version from '../entity/version';
import Application from './application';
import Namespace from '../entity/namespace';

import Microfrontend from '../entity/microfrontend';
import Deploy, { STATUS } from './deploy';

interface IDeploy {
  versions: { [key: string]: string };
}

export interface MicroVersion {
  microfrontend: Microfrontend;
  version: Version;
}

class CompiledDeploy {
  public application: Application;
  public namespace: Namespace;
  public deploy: Deploy;
  public versionsByMicrofrontend: MicroVersion[];
  public user: User;

  static async mountSingle(application: Application, user: User, namespace: Namespace) {
    const deploy = await namespace.getNextDeploy();
    const versionsByMicrofrontend = await deploy.getVersionsToDeployByMicrofrontend();
    return new CompiledDeploy(application, namespace, deploy, versionsByMicrofrontend, user);
  }

  static async mount(application: Application, user: User) {
    const namespaces = await Namespace.createQueryBuilder().where(`applicationId = ${application.id}`).getMany();
    if (!namespaces.length) {
      return [];
    }

    const deploysToDo = await Promise.all(
      namespaces.map(async (namespace) => {
        const deploy = await namespace.getNextDeploy();
        const versionsByMicrofrontend = await deploy.getVersionsToDeployByMicrofrontend();
        return new CompiledDeploy(application, namespace, deploy, versionsByMicrofrontend, user);
      })
    );

    return deploysToDo;
  }

  static async downloadAll(destFolder: string, deploysToDo: CompiledDeploy[], user: User) {
    const alreadyDownloadedVersions: { [key: string]: boolean } = {};
    const alreadyDownloadedMicroversions: { [key: string]: boolean } = {};

    const downloadArtifacts = async (microVersion: { microfrontend: Microfrontend; version: Version }) => {
      const { microfrontend, version } = microVersion;
      if (alreadyDownloadedVersions[version.id] && alreadyDownloadedMicroversions[microfrontend.id]) return;

      const { githubId, packageName } = microfrontend;
      const { sha, name } = version;

      const tree = await getTree(githubId, sha, user);
      await downloadTree(`${destFolder}/microfrontends/${packageName}/${name}`, tree, user!);

      alreadyDownloadedVersions[version.id] = true;
      alreadyDownloadedMicroversions[microfrontend.id] = true;
    };

    for (let i = 0; i < deploysToDo.length; i++) {
      const deploy = deploysToDo[i];

      for (let k = 0; k < deploy.versionsByMicrofrontend.length; k++) {
        const microVersion = deploy.versionsByMicrofrontend[k];
        await downloadArtifacts(microVersion);
      }
    }
  }

  static async updateState(deploysToDo: CompiledDeploy[]) {
    await Promise.all(
      deploysToDo.map(async (deployToDo) => {
        const { deploy, namespace } = deployToDo;
        deploy.updateStatus(STATUS.CURRENT);

        namespace.currentDeployId = deploy.id;
      })
    );
  }

  static async deploy(application: Application, user: User, deploysToDo: CompiledDeploy[]) {
    throw new Error('fix');
    // const dest = `/tmp/${application.id}`;
    // await CompiledDeploy.downloadAll(dest, deploysToDo, user);
    // await PackageAll({ rootFolder: dest, deploysToDo });
    // const tree = await getTreeFromFolder(`${dest}/build`);
    // await uploadTree(application.githubId, tree, user!, 'my versiion');
    // await CompiledDeploy.updateState(deploysToDo);
  }

  constructor(
    application: Application,
    namespace: Namespace,
    deploy: Deploy,
    versionsByMicrofrontend: MicroVersion[],
    user: User
  ) {
    this.application = application;
    this.namespace = namespace;
    this.user = user;
    this.deploy = deploy;
    this.versionsByMicrofrontend = versionsByMicrofrontend;
  }
}

export default CompiledDeploy;
