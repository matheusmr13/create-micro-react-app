import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import dayJs from 'dayjs';

import Microfrontend, { TYPE } from 'entity/microfrontend';
import Namespace from 'entity/namespace';
import Integration from './integration/base';
import GithubIntegration from './integration/base';

interface IApplication {
  name: string;
  packageName: string;
  slackChannelId: string;
}

@Entity()
class Application extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string = '';

  @Column()
  public name: string = '';

  @Column()
  public ownerId: string = '';

  @Column()
  public createdAt: string = '';

  @Column('simple-json', { nullable: true })
  public destIntegration?: Integration;

  @Column()
  public slackChannelId: string = '';

  static async createFromRepository(repository: any, payload: IApplication, ownerId: string) {
    const applicationName = repository.name;

    const destIntegration = new GithubIntegration({
      repository: repository.full_name,
    });
    const application = Application.create({
      name: applicationName,
      ownerId,
      createdAt: dayJs().format(),
      destIntegration,
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
