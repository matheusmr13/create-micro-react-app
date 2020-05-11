import express from 'express';
import VersionController from './controller';
import { asyncRequestHandler } from 'base/router';

const VersionRouter = express.Router();
VersionRouter.get('/:uuid', asyncRequestHandler(VersionController.read));
VersionRouter.get('/', asyncRequestHandler(VersionController.list));

VersionRouter.post('/clear', asyncRequestHandler(VersionController.clear));
VersionRouter.post('/:uuid/approve', asyncRequestHandler(VersionController.approve));

export default VersionRouter;
