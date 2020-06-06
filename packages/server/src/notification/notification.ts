import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import SlackMessage from './integrations/slack';
import Application from '../entity/application';
import UserExtra from '../entity/user-extra';
import CompiledDeploy from '../entity/compiled-deploy';
import Deploy from '../entity/deploy';
import Namespace from '../entity/namespace';

@Entity()
class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string = '';

  @Column()
  public name: string = '';

  @Column()
  public ownerId: string = '';

  @Column()
  public createdAt: string = '';

  @Column()
  public content: string = '';

  @Column()
  public isSent: boolean = false;

  static build(content: string) {
    return Notification.create({ content });
  }

  static async sendBeforeDeploy(user: UserExtra, application: Application) {
    await SlackMessage.sendSimple(user.slackToken, application.slackChannelId, 'Starting deploy');
  }

  static async sendChangeNextDeploy(
    user: UserExtra,
    application: Application,
    namespace: Namespace,
    nextDeploy: Deploy
  ) {
    const slackMessage = new SlackMessage(user.slackToken, application.slackChannelId);
    slackMessage.addText(`Next deploy from application "${application.name}" namespace "${namespace.name}" changed:`);

    const nextDeployToDo = await CompiledDeploy.mountSingle(application, user, namespace);
    const { versionsByMicrofrontend } = nextDeployToDo;
    slackMessage.addSeparator();
    slackMessage.addText(
      versionsByMicrofrontend
        .map(({ microfrontend, version }) => `\`${microfrontend.name} (${version.name})\``)
        .join(' ')
    );

    slackMessage.send();
  }

  static async sendAfterDeploy(user: UserExtra, application: Application, deploysDone: CompiledDeploy[]) {
    const slackMessage = new SlackMessage(user.slackToken, application.slackChannelId);
    slackMessage.addText('Deploy done, current namespaces:');

    deploysDone.forEach((deployToDo) => {
      const { namespace, versionsByMicrofrontend } = deployToDo;
      slackMessage.addSeparator();
      slackMessage.addText(namespace.name);
      slackMessage.addText(
        versionsByMicrofrontend
          .map(({ microfrontend, version }) => `\`${microfrontend.name} (${version.name})\``)
          .join(' ')
      );
    });

    await slackMessage.send();
  }
}

export default Notification;
