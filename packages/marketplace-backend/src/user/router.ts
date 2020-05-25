import express from 'express';
import UserController from './controller';
import { asyncRequestHandler } from 'base/router';

const UserRouter = express.Router();
UserRouter.get('/', asyncRequestHandler(UserController.list));

UserRouter.get('/me', asyncRequestHandler(UserController.getMe));
UserRouter.put('/me', asyncRequestHandler(UserController.updateMe));

export default UserRouter;
