import express from 'express';
import Microfrontend from './model';
import { getGithubRepository } from 'github/client';
import User from 'user/user';
import BaseController from 'base/controller';
import { Request, Response } from 'express';

class MicrofrontendController extends BaseController<typeof Microfrontend> {
  constructor() {
    super(Microfrontend);
  }

  list = this.createFilteredByList(['applicationId']);

  public syncVersions = async (req: Request, res: Response) => {
    try {
      const [microfrontend] = await Microfrontend.find(req.params.uuid);
      if (!microfrontend) {
        res.status(404).send();
        return;
      }
      const { id } = res.locals.tokenAuth;
      const [user] = await User.find(id);
      if (!user) {
        res.status(500).send();
        return;
      }

      await microfrontend.syncVersions(user);

      res.json('ok');
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  };

  public import = async (req: Request, res: Response) => {
    try {
      const { id } = res.locals.tokenAuth;
      const repository = await getGithubRepository(req.body.repositoryName);
      const application = await Microfrontend.createFromRepository(repository, req.body, id);
      res.json(application.toJSON());
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  };
}

export default new MicrofrontendController();
