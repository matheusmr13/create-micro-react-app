import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import dayJs from 'dayjs';
import User from './user';
import { getFoldersFromGithub } from '../github/client';
import Version from '../entity/version';
import { INTEGRATION_TYPE } from './integration/types';
import AwsS3Integration from './integration/aws-s3';

enum APPROVAL_TYPE {
  NEEDS_REVISION = 'NEEDS_APROVAL',
  AUTO_APPROVE = 'AUTO_APPROVE',
}

export enum TYPE {
  MICROFRONTEND = 'MICROFRONTEND',
  CONTAINER = 'CONTAINER',
}

interface IMicrofrontend {
  name?: string;
  applicationId: string;
  packageName: string;
  ownerId: string;
  type?: TYPE;
  integrationType?: INTEGRATION_TYPE;
  originId?: string;
}

@Entity()
class Microfrontend extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column()
  public name: string = '';

  @Column()
  public ownerId: string = '';

  @Column()
  public createdAt: string = '';

  @Column()
  public packageName: string = '';

  @Column({ nullable: true })
  public integrationType?: INTEGRATION_TYPE;

  @Column({ nullable: true })
  public originId: string = '';

  @Column()
  public applicationId: string = '';

  @Column()
  public approvalType: APPROVAL_TYPE = APPROVAL_TYPE.NEEDS_REVISION;

  @Column()
  public type: TYPE = TYPE.MICROFRONTEND;

  static async createInstance(payload: IMicrofrontend) {
    const microfrontend = Microfrontend.create({
      ...payload,
      createdAt: dayJs().format(),
    });
    await microfrontend.save();
    await microfrontend.syncVersions();
    return microfrontend;
  }

  async syncVersions() {
    const user = await User.findOne(this.ownerId);

    let versions = [];
    if (this.integrationType === INTEGRATION_TYPE.GITHUB) {
      const githubUrl = `/repos/${this.originId}/contents/versions/${this.packageName}`;
      versions = await getFoldersFromGithub(githubUrl, user!);
    } else if (this.integrationType === INTEGRATION_TYPE.AWS_S3) {
      versions = await AwsS3Integration.getVersions(this.originId, this.packageName);
    }

    const microfrontendVersions = await Version.createQueryBuilder()
      .where(`Version.microfrontendId = :id`)
      .setParameter('id', this.id)
      .getMany();

    const notSynchedVersions = versions.filter(
      (version: any) => !microfrontendVersions.find((applicationVersion) => applicationVersion.name === version.name)
    );

    await Promise.all(
      notSynchedVersions.map(async (version: any) => {
        const newVersion = Version.build({
          microfrontendId: this.id!,
          name: version.name,
          path: version.path,
        });
        await newVersion.save();
      })
    );
  }
}

export default Microfrontend;
