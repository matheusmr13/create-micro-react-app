import { Column, Entity } from 'ts-datastore-orm';
import { v4 as uuidv4 } from 'uuid';
import dayJs from 'dayjs';
import BasicEntity from 'base/basic-entity';

import Microfrontend, { TYPE } from 'microfrontend/model';
import Namespace from 'namespace/model';

interface IApplication {
  name: string;
  packageName: string;
  slackChannelId: string;
}

@Entity({ kind: 'application' })
class Application extends BasicEntity {
  @Column()
  public githubId: string = '';

  @Column()
  public slackChannelId: string = '';

  static async createFromRepository(repository: any, payload: IApplication, ownerId: string) {
    const applicationName = repository.name;

    const application = Application.create({
      name: applicationName,
      githubId: repository.full_name,
      ownerId,
      createdAt: dayJs().format(),
      id: uuidv4(),
    });
    await application.save();

    const containerMicrofrontend = await Microfrontend.createFromRepository(
      repository,
      {
        name: 'Container',
        applicationId: application.id,
        packageName: payload.packageName,
      },
      ownerId
    );
    containerMicrofrontend.type = TYPE.CONTAINER;
    await containerMicrofrontend.save();

    const mainNamespace = await Namespace.createEntity(
      {
        name: 'Main namespace',
        path: '/',
        applicationId: application.id,
      },
      ownerId
    );
    mainNamespace.isMain = true;
    await mainNamespace.save();

    return application;
  }
}

export default Application;
