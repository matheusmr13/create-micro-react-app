import express, { NextFunction, Request, Response } from 'express';
import { datastoreOrm } from 'ts-datastore-orm';

import AuthRouter from './auth/router';
import AuthFilter from './auth/filter';

import MicrofrontendRouter from './microfrontend/router';
import ApplicationRouter from './application/router';
import NamespaceRouter from './namespace/router';
import VersionRouter from './version/router';
import UserRouter from './user/router';

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
app.use('/', AuthRouter);
app.use('/oauth', AuthRouter);
app.get('/clear', async (req, res) => {
  await Application.clear();
  await Deploy.clear();
  await Microfrontend.clear();
  await Namespace.clear();
  await Version.clear();
  res.send();
}); // TODO: remove
app.use(AuthFilter);
app.use('/microfrontends', MicrofrontendRouter);
app.use('/applications', ApplicationRouter);
app.use('/namespaces', NamespaceRouter);
app.use('/versions', VersionRouter);
app.use('/users', UserRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

datastoreOrm.addConnection('default', getGoogleCloudConfig());

const { PORT = 8080 } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
