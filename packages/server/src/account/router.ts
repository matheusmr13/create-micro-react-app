import express from 'express';
import UserController from './controller';
import { asyncRequestHandler } from '../base/router';

const UserRouter = express.Router();
UserRouter.get('/', asyncRequestHandler(UserController.list));

UserRouter.get('/:uuid/extra', asyncRequestHandler(UserController.getExtra));
UserRouter.put('/:uuid/extra', asyncRequestHandler(UserController.updateExtra));

export default UserRouter;
