import express from 'express';
import AuthController from './controller';
import { asyncRequestHandler } from 'base/router';

const AuthRouter = express.Router();
AuthRouter.post('/', asyncRequestHandler(AuthController.oauth));

export default AuthRouter;
