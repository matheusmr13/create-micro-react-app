import { Request, Response } from 'express';
import Application from '../entity/application';
import { getGithubRepository } from '../github/client';
import BaseController from '../base/controller';
import CompiledDeploy from '../entity/compiled-deploy';
import Notification from '../notification/notification';
import UserExtra from '../entity/user-extra';

class ApplicationController extends BaseController<typeof Application> {
  constructor() {
    super(Application);
  }
  public import = this.withContext(async (req: Request, res: Response, context) => {
    const user = await context.getUser();
    const repository = await getGithubRepository(req.body.repositoryName);
    const application = await Application.createFromRepository(repository, req.body, user.id);
    res.json(application);
  });

  public deploy = this.withContext(async (req: Request, res: Response, context) => {
    const application = await context.getInstance();
    const user = await UserExtra.findOne(application.ownerId);
    if (!user) throw new Error();

    await Notification.sendBeforeDeploy(user, application);
    const deploysToDo = await CompiledDeploy.mount(application, user);
    await CompiledDeploy.deploy(application, user, deploysToDo);
    await Notification.sendAfterDeploy(user, application, deploysToDo);

    res.json(application);
  });
}

export default new ApplicationController();
