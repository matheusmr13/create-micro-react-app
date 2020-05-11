import BaseController from 'base/controller';
import { Request, Response } from 'express';
import Version from './model';

class VersionController extends BaseController<typeof Version> {
  constructor() {
    super(Version);
  }

  list = this.createFilteredByList(['microfrontendId']);

  public approve = async (req: Request, res: Response) => {
    let [version] = await Version.find(req.params.uuid);
    if (!version) {
      res.status(404).send();
      return;
    }

    version = await version.approve();
    res.json(version.toJSON());
  };
}

export default new VersionController();
