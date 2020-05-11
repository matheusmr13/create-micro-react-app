import { BaseEntity, Column, Entity } from 'ts-datastore-orm';
import { v4 as uuidv4 } from 'uuid';
import dayJs from 'dayjs';
import User from 'user/user';
import { getFoldersFromGithub } from 'github/client';
import Version from 'version/model';
import BasicEntity from '../base/basic-entity';

enum APPROVAL_TYPE {
  NEEDS_REVISION = 'NEEDS_APROVAL',
  AUTO_APPROVE = 'AUTO_APPROVE',
}

enum TYPE {
  MICROFRONTEND,
  CONTAINER,
}

interface IMicrofrontend {
  name: string;
  applicationId: string;
  packageName: string;
  type?: TYPE;
}

@Entity({ namespace: 'testing', kind: 'microfrontend' })
class Microfrontend extends BasicEntity {
  @Column()
  public packageName: string = '';

  @Column()
  public githubId: string = '';

  @Column({ index: true })
  public applicationId: string = '';

  @Column()
  public approvalType: APPROVAL_TYPE = APPROVAL_TYPE.NEEDS_REVISION;

  @Column()
  public type: TYPE = TYPE.MICROFRONTEND;

  static async createFromRepository(repository: any, payload: IMicrofrontend, ownerId: string) {
    const application = Microfrontend.create({
      name: repository.name,
      ...payload,
      githubId: repository.full_name,
      ownerId,
      createdAt: dayJs().format(),
      id: uuidv4(),
    });
    await application.save();
    return application;
  }

  async syncVersions(user: User) {
    const githubUrl = `/repos/${this.githubId}/contents/versions/${this.packageName}`;
    const versions = await getFoldersFromGithub(githubUrl, user);

    const [microfrontendVersions] = await Version.query().filter('microfrontendId', '=', this.id).run();

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
