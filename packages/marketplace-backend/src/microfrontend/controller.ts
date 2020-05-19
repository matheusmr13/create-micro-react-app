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

  public syncVersions = this.createInstanceAction(async (microfrontend, req: Request, res: Response) => {
    await microfrontend.syncVersions();
    return microfrontend;
  });

  public import = async (req: Request, res: Response) => {
    try {
      const { id } = req.locals.tokenAuth;
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
