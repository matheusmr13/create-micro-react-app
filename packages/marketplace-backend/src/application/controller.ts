import { Request, Response } from 'express';
import Application from './model';
import { getGithubRepository } from '../github/client';
import User from 'user/user';
import deploy from './deploy';
import BaseController from 'base/controller';

class ApplicationController extends BaseController<typeof Application> {
  constructor() {
    super(Application);
  }
  public import = async (req: Request, res: Response) => {
    try {
      const { id } = req.locals.tokenAuth;
      const repository = await getGithubRepository(req.body.repositoryName);
      const application = await Application.createFromRepository(repository, req.body, id);
      res.json(application.toJSON());
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  };

  public deploy = async (req: Request, res: Response) => {
    try {
      const [application] = await Application.find(req.params.uuid);
      if (!application) {
        res.status(404).send();
        return;
      }
      const { id } = res.locals.tokenAuth;
      const [user] = await User.find(id);
      if (!user) {
        res.status(500).send();
        return;
      }

      const microVersion = req.body;
      await deploy(microVersion, user, application);

      res.json('ok');
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  };
}

export default new ApplicationController();
