import { Request, Response } from 'express';
import Application from '../entity/application';
import { getGithubRepository } from '../github/client';
import BaseController from '../base/controller';
import CompiledDeploy from '../entity/deploy/application-deploy';
import Notification from '../notification/notification';
import User from '../entity/user';
import { INTEGRATION_TYPE } from '../entity/integration/types';
import ApplicationDeploy from '../entity/deploy/application-deploy';
import Microfrontend from '../entity/microfrontend';
import Namespace from '../entity/namespace';
import { app } from 'firebase-admin';

class ApplicationController extends BaseController<typeof Application> {
  constructor() {
    super(Application);
  }
  public import = this.withContext(async (req: Request, res: Response, context) => {
    const user = await context.getUser();
    const repository = await getGithubRepository(req.body.repositoryName);
    const application = await Application.createInstance({
      integrationType: INTEGRATION_TYPE.GITHUB,
      integrationId: repository.full_name,
      ownerId: user.id,
      ...req.body,
    });
    res.json(application);
  });

  public deploy = this.withContext(async (req: Request, res: Response, context) => {
    const application = await context.getInstance();
    const user = await User.findOne(application.ownerId);

    const applicationDeploy = new ApplicationDeploy(application, user!);
    await applicationDeploy.execute();

    // await Notification.sendBeforeDeploy(user, application);
    // const deploysToDo = await CompiledDeploy.mount(application, user);
    // await CompiledDeploy.deploy(application, user, deploysToDo);
    // await Notification.sendAfterDeploy(user, application, deploysToDo);

    res.json(application);
  });

  public create = this.withContext(async (req: Request, res: Response, context) => {
    const user = await context.getUser();
    const application = await Application.createInstance({
      ownerId: user.id,
      ...req.body,
    });
    res.json(application);
  });

  public instantDeploy = this.withContext(async (req: Request, res: Response, context) => {
    const { microfrontendId, namespacePath, versionName } = req.body;
    const application = await context.getInstance();
    const user = await context.getUser();
    const microfrontend = await Microfrontend.findOne(microfrontendId);
    await microfrontend!.syncVersions();

    let namespace = await Namespace.createQueryBuilder()
      .where(`Namespace.path = :path`)
      .andWhere(`Namespace.applicationId = :applicationId`)
      .setParameter('path', namespacePath)
      .setParameter('applicationId', application.id)
      .getOne();
    if (!namespace) {
      namespace = await Namespace.createInstance({
        applicationId: application.id!,
        name: namespacePath,
        path: namespacePath,
        ownerId: user.id,
      });

      const mainNamespace = await Namespace.createQueryBuilder()
        .andWhere(`Namespace.applicationId = :applicationId`)
        .andWhere(`Namespace.isMain = true`)
        .setParameter('applicationId', application.id)
        .getOne();

      const mainNextDeploy = mainNamespace?.getNextDeploy();
      mainNextDeploy.
    }



    res.json({});
  });
}

export default new ApplicationController();
