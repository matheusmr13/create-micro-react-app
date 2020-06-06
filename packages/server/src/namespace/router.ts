import express from 'express';
import NamespaceController from './controller';
import { asyncRequestHandler } from '../base/router';

const NamespaceRouter = express.Router();
NamespaceRouter.get('/:uuid', asyncRequestHandler(NamespaceController.read));
NamespaceRouter.put('/:uuid', asyncRequestHandler(NamespaceController.update));
NamespaceRouter.delete('/:uuid', asyncRequestHandler(NamespaceController.delete));
NamespaceRouter.get('/', asyncRequestHandler(NamespaceController.list));
NamespaceRouter.post('/', asyncRequestHandler(NamespaceController.create));

NamespaceRouter.get('/:uuid/history', asyncRequestHandler(NamespaceController.getHistory));
NamespaceRouter.get('/:uuid/deploy/next', asyncRequestHandler(NamespaceController.getNextDeploy));
NamespaceRouter.put('/:uuid/deploy/next', asyncRequestHandler(NamespaceController.updateNextDeploy));

export default NamespaceRouter;
