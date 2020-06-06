import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import dayJs from 'dayjs';
import Version from 'entity/version';

import Microfrontend from 'entity/microfrontend';

interface IDeploy {
  versions: { [key: string]: string };
}

export enum STATUS {
  NEXT = 'NEXT',
  CURRENT = 'CURRENT',
  PREVIOUS = 'PREVIOUS',
}

@Entity()
class Deploy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string = '';

  @Column()
  public name: string = '';

  @Column()
  public ownerId: string = '';

  @Column()
  public createdAt: string = '';

  @Column('simple-json')
  public versions: { [key: string]: string } = {};

  @Column()
  public applicationId: string = '';

  @Column()
  public namespaceId: string = '';

  @Column()
  public status: STATUS = STATUS.NEXT;

  static async createEntity(payload: IDeploy, applicationId: string, namespaceId: string) {
    const deploy = Deploy.create({
      ...payload,
      applicationId,
      namespaceId,
      createdAt: dayJs().format(),
      id: uuidv4(),
    });
    await deploy.save();

    return deploy;
  }

  async updateStatus(status: STATUS) {
    this.status = status;
    await this.save();
    return this;
  }

  getVersionsToDeployByMicrofrontend = async () => {
    const versionsByMicrofrontend = await Promise.all(
      Object.entries(this.versions).map(async ([microfrontendId, versionId]) => {
        if (typeof versionId !== 'string') return null;

        const microfrontend = await Microfrontend.findOne(microfrontendId);
        const version = await Version.findOne(versionId);
        if (!version || !microfrontend) return null;

        return {
          microfrontend,
          version,
        };
      })
    );

    return versionsByMicrofrontend.filter(function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
      return value !== null && value !== undefined;
    });
  };
}

export default Deploy;
