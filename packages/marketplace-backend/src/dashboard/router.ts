import express from 'express';
import DashboardController from './controller';
import { asyncRequestHandler } from 'base/router';

const DashboardRouter = express.Router();
DashboardRouter.get('/', asyncRequestHandler(DashboardController.getDashboard));

export default DashboardRouter;
