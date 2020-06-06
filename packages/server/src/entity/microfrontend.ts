import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import dayJs from 'dayjs';
import User from '../entity/user-extra';
import { getFoldersFromGithub } from '../github/client';
import Version from '../entity/version';

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
  type?: TYPE;
}

@Entity()
class Microfrontend extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string = '';

  @Column()
  public name: string = '';

  @Column()
  public ownerId: string = '';

  @Column()
  public createdAt: string = '';

  @Column()
  public packageName: string = '';

  @Column()
  public githubId: string = '';

  @Column()
  public applicationId: string = '';

  @Column()
  public approvalType: APPROVAL_TYPE = APPROVAL_TYPE.NEEDS_REVISION;

  @Column()
  public type: TYPE = TYPE.MICROFRONTEND;

  static async createFromRepository(repository: any, payload: IMicrofrontend, ownerId: string) {
    const microfrontend = Microfrontend.create({
      name: payload.packageName,
      ...payload,
      githubId: repository.full_name,
      ownerId,
      createdAt: dayJs().format(),
    });
    await microfrontend.save();
    await microfrontend.syncVersions();
    return microfrontend;
  }

  async syncVersions() {
    const user = await User.findOne(this.ownerId);
    const githubUrl = `/repos/${this.githubId}/contents/versions/${this.packageName}`;
    const versions = await getFoldersFromGithub(githubUrl, user!);

    const microfrontendVersions = await Version.createQueryBuilder().where(`microfrontendId = ${this.id}`).getMany();

    await Promise.all(
      versions
        .filter(
          (version: any) =>
            !microfrontendVersions.find((applicationVersion) => applicationVersion.name === version.name)
        )
        .map(async (version: any) => {
          const newVersion = Version.build({
            microfrontendId: this.id,
            name: version.name,
            sha: version.sha,
          });
          await newVersion.save();
        })
    );
  }
}

export default Microfrontend;
