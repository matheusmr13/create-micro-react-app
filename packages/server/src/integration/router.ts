import express from 'express';
import IntegrationController from './controller';
import { asyncRequestHandler } from '../base/router';

const IntegrationRouter = express.Router();
IntegrationRouter.get('/', asyncRequestHandler(IntegrationController.list));
IntegrationRouter.get('/:id', asyncRequestHandler(IntegrationController.get));
IntegrationRouter.get('/:id/destination', asyncRequestHandler(IntegrationController.listDestination));
IntegrationRouter.get('/:id/origin', asyncRequestHandler(IntegrationController.listOrigin));

export default IntegrationRouter;
