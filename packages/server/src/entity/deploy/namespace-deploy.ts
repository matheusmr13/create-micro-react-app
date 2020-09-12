import Namespace from '../namespace';

import MicrofrontendDeploy from './microfrontend-deploy';
import { DeployPath, NamespaceDeployPath } from './path';
import Deploy, { STATUS } from '../deploy';
import { TYPE } from '../microfrontend';
import { writeJson } from '../../external/utils/fs';
import ApplicationDeploy from './application-deploy';
import AwsS3Integration from '../integration/aws-s3';

type MicrofrontendDeployMap = { [key: string]: MicrofrontendDeploy };

class NamespaceDeploy {
  private microfrontendDeploys: MicrofrontendDeploy[] = [];
  public path: NamespaceDeployPath;
  public deploy?: Deploy;
  constructor(public namespace: Namespace, opts: { path: NamespaceDeployPath }) {
    this.path = opts.path;
  }

  getMicrofrontendMetaJson() {
    return this.microfrontendDeploys
      .filter((microfrontendDeploy) => microfrontendDeploy.microfrontend.type === TYPE.MICROFRONTEND)
      .reduce(
        (agg, microfrontendDeploy) =>
          Object.assign(agg, {
            [microfrontendDeploy.microfrontend.packageName]: microfrontendDeploy.files,
          }),
        {}
      );
  }

  async mount(microfrontendDeploys: MicrofrontendDeployMap) {
    this.deploy = await this.namespace.getNextDeploy();

    const newMicrofrontendDeploys = await Promise.all(
      Object.entries(this.deploy.versions).map(async ([microfrontendId, versionId]) => {
        const alreadyMountedMicrofrontendDeploy = microfrontendDeploys[versionId];
        if (alreadyMountedMicrofrontendDeploy) {
          this.microfrontendDeploys.push(alreadyMountedMicrofrontendDeploy);
          return null;
        }
        if (!versionId) return null;
        const microfrontendDeploy = await MicrofrontendDeploy.mount(microfrontendId, versionId, { path: this.path });
        this.microfrontendDeploys.push(microfrontendDeploy);
        return microfrontendDeploy;
      })
    );

    const filtered = <MicrofrontendDeploy[]>(
      newMicrofrontendDeploys.filter((microfrontendDeploy) => !!microfrontendDeploy)
    );

    return filtered.reduce(
      (agg, microfrontendDeploy) =>
        Object.assign(agg, {
          [microfrontendDeploy.version.id]: microfrontendDeploy,
        }),
      { ...microfrontendDeploys }
    );
  }

  async package() {
    await Promise.all(
      this.microfrontendDeploys.map(async (microfrontendDeploy) => {
        await microfrontendDeploy.package(this);
      })
    );
    await writeJson(this.path.microfrontendMetaJson, this.getMicrofrontendMetaJson());
  }

  async upload(applicationDeploy: ApplicationDeploy) {
    await Promise.all(
      this.microfrontendDeploys.map(async (microfrontendDeploy) => {
        await microfrontendDeploy.upload(this, applicationDeploy);
      })
    );

    await AwsS3Integration.uploadFile({
      bucket: applicationDeploy.application.destinationId,
      origin: this.path.microfrontendMetaJson,
      dest: this.path.microfrontendBucketMetaJson,
    });
  }

  async updateState() {
    const { deploy, namespace } = this;
    if (!deploy || !namespace) throw new Error();

    const previousDeploy = await namespace.getCurrentDeploy();
    previousDeploy.updateStatus(STATUS.PREVIOUS);

    const nextDeploy = await Deploy.createEntity(
      {
        versions: deploy.versions,
      },
      namespace.applicationId,
      namespace.id
    );
    await nextDeploy.save();

    deploy.updateStatus(STATUS.CURRENT);

    // const previousDeploy = await Deploy.

    namespace.currentDeployId = deploy!.id;
    namespace.nextDeployId = nextDeploy.id;
    await namespace.save();
  }
}

export default NamespaceDeploy;
