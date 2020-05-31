import express, { NextFunction, Request, Response } from 'express';
import { datastoreOrm } from 'ts-datastore-orm';

import AuthFilter from './account/filter';
import ErrorFilter from 'base/error-filter';

import DashboardsRouter from './dashboard/router';
import MicrofrontendRouter from './microfrontend/router';
import ApplicationRouter from './application/router';
import NamespaceRouter from './namespace/router';
import VersionRouter from './version/router';
import UserRouter from './account/router';

import cors from 'cors';
import Application from 'application/model';
import Deploy from 'deploy/state';
import Microfrontend from 'microfrontend/model';
import Namespace from 'namespace/model';
import Version from 'version/model';

import { getGoogleCloudConfig } from './config';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', AuthFilter);
app.get('/clear', async (req, res) => {
  await Application.clear();
  await Deploy.clear();
  await Microfrontend.clear();
  await Namespace.clear();
  await Version.clear();
  res.send();
}); // TODO: remove
app.use(AuthFilter);
app.use('/dashboards', DashboardsRouter);
app.use('/microfrontends', MicrofrontendRouter);
app.use('/applications', ApplicationRouter);
app.use('/namespaces', NamespaceRouter);
app.use('/versions', VersionRouter);
app.use('/users', UserRouter);
app.use(ErrorFilter);

datastoreOrm.addConnection('default', getGoogleCloudConfig());

const { PORT = 8080 } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
