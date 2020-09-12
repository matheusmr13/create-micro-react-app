import { Request, Response } from 'express';
import Namespace from '../entity/namespace';
import BaseController from '../base/controller';
import Notification from '../notification/notification';
import Application from '../entity/application';
import Deploy from '../entity/deploy';

class NamespaceController extends BaseController<typeof Namespace> {
  constructor() {
    super(Namespace);
  }

  public create = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    const namespace = await Namespace.createInstance({
      ownerId: user.id,
      ...req.body,
    });
    res.json(namespace);
  });

  public updateNextDeploy = this.withContext(async (req: Request, res: Response, context) => {
    const namespace = await context.getInstance();
    const application = await Application.findOne(namespace.applicationId);
    const user = await context.getUser();
    let nextDeploy = await namespace.getNextDeploy();
    nextDeploy = Deploy.merge(nextDeploy, req.body);
    await nextDeploy.save();
    const userExtra = await user.getExtra();

    Notification.sendChangeNextDeploy(userExtra, application!, namespace, nextDeploy);
    res.json(nextDeploy);

    return undefined;
  });

  public getNextDeploy = this.createInstanceAction(async (namespace, req: Request, res: Response) => {
    const nextDeploy = await namespace.getNextDeploy();
    res.json(nextDeploy);
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
