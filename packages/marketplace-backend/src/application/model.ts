import { Column, Entity } from 'ts-datastore-orm';
import { v4 as uuidv4 } from 'uuid';
import dayJs from 'dayjs';
import BasicEntity from 'base/basic-entity';

import Microfrontend from 'microfrontend/model';

interface IApplication {
  name: string;
  packageName: string;
}

@Entity({ namespace: 'testing', kind: 'application' })
class Application extends BasicEntity {
  @Column({ index: true })
  public id: string = '';

  @Column()
  public githubId: string = '';

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
        name: `${applicationName} Container`,
        applicationId: application.id,
        packageName: payload.packageName,
      },
      ownerId
    );

    await containerMicrofrontend.save();

    return application;
  }
}

export default Application;
