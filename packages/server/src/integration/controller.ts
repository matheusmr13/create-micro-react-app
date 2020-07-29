import { Request, Response } from 'express';
import { INTEGRATION_TYPE, INTEGRATION_TYPE_CLASS } from '../entity/integration/types';

class IntegrationController {
  public list = async (req: Request, res: Response) => {
    res.json(Object.keys(INTEGRATION_TYPE).map((integration) => ({ id: integration })));
  };

  public get = async (req: Request, res: Response) => {
    const integrationId = <INTEGRATION_TYPE>req.params.id;
    // const integration = INTEGRATION_TYPE_CLASS[integrationId];
    res.json({ id: integrationId });
  };

  public listDestination = async (req: Request, res: Response) => {
    const integrationId = <INTEGRATION_TYPE>req.params.id;
    const IntegrationClazz = INTEGRATION_TYPE_CLASS[integrationId];
    const integration = new IntegrationClazz({});
    const list = await integration.listDestinationOptions();
    res.json(list);
  };

  public listOrigin = async (req: Request, res: Response) => {
    const integrationId = <INTEGRATION_TYPE>req.params.id;
    const IntegrationClazz = INTEGRATION_TYPE_CLASS[integrationId];
    const integration = new IntegrationClazz({});
    const list = await integration.listOriginOptions();
    res.json(list);
  };
}

export default new IntegrationController();
