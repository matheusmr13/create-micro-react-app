import Microfrontend from './model';
import { getGithubRepository } from 'github/client';
import BaseController from 'base/controller';

class MicrofrontendController extends BaseController<typeof Microfrontend> {
  constructor() {
    super(Microfrontend);
  }

  list = this.createFilteredByList(['applicationId']);

  public syncVersions = this.createInstanceAction(async (microfrontend) => {
    await microfrontend.syncVersions();
    return microfrontend;
  });

  public import = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    const repository = await getGithubRepository(req.body.repositoryName);
    const application = await Microfrontend.createFromRepository(repository, req.body, user.id);
    res.json(application.toJSON());
  });
}

export default new MicrofrontendController();
