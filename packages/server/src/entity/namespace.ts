import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import dayJs from 'dayjs';

import Deploy, { STATUS as DeployStatus } from '../entity/deploy';

interface INamespace {
  name: string;
  path: string;
  applicationId: string;
  ownerId: string;
}

@Entity()
class Namespace extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string = '';

  @Column()
  public name: string = '';

  @Column()
  public ownerId: string = '';

  @Column()
  public createdAt: string = '';

  @Column()
  public path: string = '';

  @Column()
  public applicationId: string = '';

  @Column()
  public isMain: boolean = false;

  @Column()
  public currentDeployId: string = '';

  @Column()
  public nextDeployId: string = '';

  static async createInstance(payload: INamespace) {
    const namespace = Namespace.create({
      ...payload,
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
    const nextDeploy = await Deploy.findOne(this.nextDeployId);
    return nextDeploy!;
  }

  async getCurrentDeploy() {
    const nextDeploy = await Deploy.findOne(this.currentDeployId);
    return nextDeploy!;
  }

  getDeployHistory = async () => {
    const deploys = await Deploy.createQueryBuilder()
      .where(`Deploy.applicationId = :id`)
      .setParameter('id', this.id)
      .getMany();
    return deploys;
  };
}

export default Namespace;
