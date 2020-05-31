import { Request, Response } from 'express';
import Application from './model';
import { getGithubRepository } from '../github/client';
import BaseController from 'base/controller';
import Namespace from 'namespace/model';
import User from 'account/user-extra';
import Microfrontend, { TYPE } from 'microfrontend/model';
import CompiledDeploy from 'deploy/model';
import Notification from 'notification/notification';

class ApplicationController extends BaseController<typeof Application> {
  constructor() {
    super(Application);
  }
  public import = this.withContext(async (req: Request, res: Response, context) => {
    const user = await context.getUser();
    const repository = await getGithubRepository(req.body.repositoryName);
    const application = await Application.createFromRepository(repository, req.body, user.id);
    res.json(application.toJSON());
  });

  public deploy = this.createInstanceAction(async (application, req: Request, res: Response) => {
    const [user] = await User.find(application.ownerId);
    if (!user) throw new Error();

    await Notification.sendBeforeDeploy(user, application);
    const deploysToDo = await CompiledDeploy.mount(application, user);
    await CompiledDeploy.deploy(application, user, deploysToDo);
    await Notification.sendAfterDeploy(user, application, deploysToDo);
    return application;
  });
}

export default new ApplicationController();
