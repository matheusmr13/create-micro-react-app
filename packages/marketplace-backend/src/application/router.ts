import express from 'express';
import ApplicationController from './controller';
import { asyncRequestHandler } from 'base/router';

const ApplicationRouter = express.Router();
ApplicationRouter.get('/:uuid', asyncRequestHandler(ApplicationController.read));
ApplicationRouter.put('/:uuid', asyncRequestHandler(ApplicationController.update));
ApplicationRouter.get('/', asyncRequestHandler(ApplicationController.list));
ApplicationRouter.post('/', asyncRequestHandler(ApplicationController.create));

ApplicationRouter.post('/:uuid/deploy', asyncRequestHandler(ApplicationController.deploy));
ApplicationRouter.post('/import', asyncRequestHandler(ApplicationController.import));

export default ApplicationRouter;
