import BaseController from '../base/controller';
import { Request, Response } from 'express';
import Version from '../entity/version';

class VersionController extends BaseController<typeof Version> {
  constructor() {
    super(Version);
  }

  list = this.createFilteredByList(['microfrontendId']);

  public approve = async (req: Request, res: Response) => {
    let version = await Version.findOne(req.params.uuid);
    if (!version) {
      res.status(404).send();
      return;
    }

    version = await version.approve();
    res.json(version);
  };
}

export default new VersionController();
