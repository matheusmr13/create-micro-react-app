import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import dayJs from 'dayjs';

import Microfrontend, { TYPE } from '../entity/microfrontend';
import Namespace from '../entity/namespace';
import { INTEGRATION_TYPE } from './integration/types';

interface IApplication {
  ownerId: string;
  name: string;
  packageName: string;
  slackChannelId?: string;
  integrationType?: INTEGRATION_TYPE;
  destinationId?: string;
}

@Entity()
class Application extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column()
  public name: string = '';

  @Column()
  public ownerId: string = '';

  @Column()
  public createdAt: string = '';

  @Column({ nullable: true })
  public integrationType?: INTEGRATION_TYPE;

  @Column({ nullable: true })
  public destinationId: string = '';

  @Column({ nullable: true })
  public slackChannelId: string = '';

  static async createInstance(payload: IApplication) {
    const application = Application.create({
      ...payload,
      createdAt: dayJs().format(),
    });
    await application.save();

    const containerMicrofrontend = await Microfrontend.createInstance({
      name: `${payload.packageName} Container`,
      applicationId: application.id!,
      packageName: payload.packageName,
      ownerId: payload.ownerId,
    });
    containerMicrofrontend.type = TYPE.CONTAINER;
    await containerMicrofrontend.save();

    const mainNamespace = await Namespace.createInstance({
      ownerId: payload.ownerId,
      name: 'Main namespace',
      path: '/',
      applicationId: application.id!,
    });
    mainNamespace.isMain = true;
    await mainNamespace.save();

    return application;
  }
}

export default Application;
