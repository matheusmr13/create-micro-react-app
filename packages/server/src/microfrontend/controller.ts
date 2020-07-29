import Microfrontend from '../entity/microfrontend';
import { getGithubRepository } from '../github/client';
import BaseController from '../base/controller';
import { INTEGRATION_TYPE } from '../entity/integration/types';

class MicrofrontendController extends BaseController<typeof Microfrontend> {
  constructor() {
    super(Microfrontend);
  }

  list = this.createFilteredByList(['applicationId']);

  public syncVersions = this.withContext(async (req, res, context) => {
    const microfrontend = await context.getInstance();
    await microfrontend.syncVersions();
    res.json(microfrontend);
  });

  public import = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    const repository = await getGithubRepository(req.body.repositoryName);
    const application = await Microfrontend.createInstance({
      ownerId: user.id,
      integrationType: INTEGRATION_TYPE.GITHUB,
      originId: repository.full_name,
      ...req.body,
    });
    res.json(application);
  });
}

export default new MicrofrontendController();
