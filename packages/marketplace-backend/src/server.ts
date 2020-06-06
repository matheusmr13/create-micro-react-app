import 'reflect-metadata';
import express from 'express';

import AuthFilter from './account/filter';
import ErrorFilter from 'base/error-filter';

import DashboardsRouter from './dashboard/router';
import MicrofrontendRouter from './microfrontend/router';
import ApplicationRouter from './application/router';
import NamespaceRouter from './namespace/router';
import VersionRouter from './version/router';
import UserRouter from './account/router';

import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
app.use(AuthFilter);
app.use('/dashboards', DashboardsRouter);
// app.use('/microfrontends', MicrofrontendRouter);
// app.use('/applications', ApplicationRouter);
// app.use('/namespaces', NamespaceRouter);
// app.use('/versions', VersionRouter);
// app.use('/users', UserRouter);
app.use(ErrorFilter);

export default app;
