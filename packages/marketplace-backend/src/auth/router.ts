import express from 'express';
import AuthController from './controller';
import { asyncRequestHandler } from 'base/router';

const AuthRouter = express.Router();
AuthRouter.post('/github', asyncRequestHandler(AuthController.auth));

export default AuthRouter;
