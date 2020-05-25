import express from 'express';
import MicrofrontendController from './controller';
import { asyncRequestHandler } from 'base/router';

const MicrofrontendRouter = express.Router();
MicrofrontendRouter.get('/:uuid', asyncRequestHandler(MicrofrontendController.read));
MicrofrontendRouter.put('/:uuid', asyncRequestHandler(MicrofrontendController.update));
MicrofrontendRouter.get('/', asyncRequestHandler(MicrofrontendController.list));
MicrofrontendRouter.post('/', asyncRequestHandler(MicrofrontendController.create));

MicrofrontendRouter.post('/:uuid/sync', asyncRequestHandler(MicrofrontendController.syncVersions));
MicrofrontendRouter.post('/clear', asyncRequestHandler(MicrofrontendController.clear));
MicrofrontendRouter.post('/import', asyncRequestHandler(MicrofrontendController.import));

export default MicrofrontendRouter;
