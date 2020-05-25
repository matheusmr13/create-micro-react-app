import { Column, Entity } from 'ts-datastore-orm';
import { v4 as uuidv4 } from 'uuid';
import dayJs from 'dayjs';
import BasicEntity from 'base/basic-entity';
import { getTree, downloadTree, uploadTree } from '../github/client';
import User from 'user/user';
import Version from 'version/model';
import PackageAll from 'external/package-folder';
import getTreeFromFolder from 'external/list-folder';
import Application from '../application/model';

import Microfrontend from 'microfrontend/model';

interface IDeploy {
  versions: { [key: string]: string };
}

export enum STATUS {
  NEXT = 'NEXT',
  CURRENT = 'CURRENT',
  PREVIOUS = 'PREVIOUS',
}

@Entity({ kind: 'deploy' })
class Deploy extends BasicEntity {
  @Column()
  public versions: { [key: string]: string } = {};

  @Column({ index: true })
  public applicationId: string = '';

  @Column({ index: true })
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

        const [microfrontend] = await Microfrontend.find(microfrontendId);
        const [version] = await Version.find(versionId);
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
