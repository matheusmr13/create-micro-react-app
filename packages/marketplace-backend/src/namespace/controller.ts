import { Request, Response } from 'express';
import Namespace from './model';
import BaseController from 'base/controller';
import Notification from 'notification/notification';
import Application from 'application/model';

class NamespaceController extends BaseController<typeof Namespace> {
  constructor() {
    super(Namespace);
  }

  public create = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    const namespace = await Namespace.createEntity(req.body, user.id);
    res.json(namespace.toJSON());
  });

  public updateNextDeploy = this.withContext(async (req: Request, res: Response, context) => {
    const namespace = await context.getInstance();
    const [application] = await Application.find(namespace.applicationId);
    const user = await context.getUser();
    const nextDeploy = await namespace.getOrCreateNextDeploy();
    await nextDeploy.update(req.body);

    Notification.sendChangeNextDeploy(user, application!, namespace, nextDeploy);
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
