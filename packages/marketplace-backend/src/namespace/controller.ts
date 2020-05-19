import { Request, Response } from 'express';
import Namespace from './model';
import BaseController from 'base/controller';

class NamespaceController extends BaseController<typeof Namespace> {
  constructor() {
    super(Namespace);
  }

  public create = async (req: Request, res: Response) => {
    const { id } = req.locals.tokenAuth;
    const namespace = await Namespace.createEntity(req.body, id);
    res.json(namespace.toJSON());
  };

  public updateNextDeploy = this.createInstanceAction(async (namespace, req: Request, res: Response) => {
    const nextDeploy = await namespace.getOrCreateNextDeploy();
    await nextDeploy.update(req.body);

    res.json(nextDeploy.toJSON());

    return undefined;
  });

  public getNextDeploy = this.createInstanceAction(async (namespace, req: Request, res: Response) => {
    const nextDeploy = await namespace.getNextDeploy();
    res.json(nextDeploy.toJSON());
    return undefined;
  });

  public getHistory = this.createInstanceAction(async (namespace, req: Request, res: Response) => {
    const deploys = await namespace.getDeployHistory();
    res.json({
      deploys,
    });
    return undefined;
  });
}

export default new NamespaceController();
