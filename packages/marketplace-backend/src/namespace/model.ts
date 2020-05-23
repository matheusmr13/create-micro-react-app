import { Column, Entity, namespaceStats } from 'ts-datastore-orm';
import { v4 as uuidv4 } from 'uuid';
import dayJs from 'dayjs';
import BasicEntity from 'base/basic-entity';

import Microfrontend from 'microfrontend/model';
import Deploy, { STATUS as DeployStatus } from 'deploy/state';

interface INamespace {
  name: string;
  path: string;
  applicationId: string;
}

@Entity({ kind: 'namespace' })
class Namespace extends BasicEntity {
  @Column()
  public path: string = '';

  @Column({ index: true })
  public applicationId: string = '';

  @Column()
  public isMain: boolean = false;

  @Column({ index: true })
  public currentDeployId: string = '';

  @Column({ index: true })
  public nextDeployId: string = '';

  static async createEntity(payload: INamespace, ownerId: string) {
    const namespace = Namespace.create({
      ...payload,
      ownerId,
      createdAt: dayJs().format(),
      id: uuidv4(),
    });
    await namespace.save();
    await namespace.createNextDeploy();
    return namespace;
  }

  async createNextDeploy() {
    const nextDeploy = await Deploy.createEntity(
      {
        versions: {},
      },
      this.applicationId,
      this.id
    );
    this.nextDeployId = nextDeploy.id;
    await this.save();
    return nextDeploy;
  }

  async getNextDeploy() {
    const [nextDeploy] = await Deploy.find(this.nextDeployId);
    return nextDeploy!;
  }

  getOrCreateNextDeploy = async () => {
    const actualNextDeploy = await this.getNextDeploy();
    if (actualNextDeploy.status === DeployStatus.CURRENT) {
      return await this.createNextDeploy();
    }
    return actualNextDeploy;
  };

  getDeployHistory = async () => {
    const [deploys] = await Deploy.query().filter('namespaceId', '=', this.id).run();
    return deploys;
  };
}

export default Namespace;
