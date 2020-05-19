import { Request, Response } from 'express';
import Application from './model';
import { getGithubRepository } from '../github/client';
import BaseController from 'base/controller';
import Namespace from 'namespace/model';
import User from 'user/user';
import Microfrontend, { TYPE } from 'microfrontend/model';
import CompiledDeploy from 'deploy/model';

class ApplicationController extends BaseController<typeof Application> {
  constructor() {
    super(Application);
  }
  public import = async (req: Request, res: Response) => {
    const { id } = req.locals.tokenAuth;
    const repository = await getGithubRepository(req.body.repositoryName);
    const application = await Application.createFromRepository(repository, req.body, id);
    res.json(application.toJSON());
  };

  public deploy = this.createInstanceAction(async (application, req: Request, res: Response) => {
    const [user] = await User.find(application.ownerId);
    if (!user) throw new Error();

    const deploysToDo = await CompiledDeploy.buildAll(application, user);
    CompiledDeploy.deploy(application, user, deploysToDo);
    return application;
  });
}

export default new ApplicationController();
