import 'reflect-metadata';
import express from 'express';

import AuthFilter from './account/filter';
import ErrorFilter from './base/error-filter';

import DashboardsRouter from './dashboard/router';
import MicrofrontendRouter from './microfrontend/router';
import ApplicationRouter from './application/router';
import NamespaceRouter from './namespace/router';
import VersionRouter from './version/router';
import UserRouter from './account/router';

import { initializeFirebase } from './account/firebase-wrapper';
import connectToDb from './database';

import cors from 'cors';

const mountApp = (staticFolder?: string) => {
  const app = express();
  app.use(express.json());
  // app.use(cors());
  if (staticFolder) {
    app.use(express.static(staticFolder));
  }
  app.use(AuthFilter);
  app.use('/dashboards', DashboardsRouter);
  app.use('/microfrontends', MicrofrontendRouter);
  app.use('/applications', ApplicationRouter);
  app.use('/namespaces', NamespaceRouter);
  app.use('/versions', VersionRouter);
  app.use('/users', UserRouter);
  app.use(ErrorFilter);
  return app;
};

class Server {
  firebaseInitialized = false;
  databaseConnection?: Promise<void>;
  staticFolder?: string;

  withFirebaseConfig(firebaseConfig: any) {
    initializeFirebase(firebaseConfig);
    this.firebaseInitialized = true;
    return this;
  }

  withDatabase(databaseConfig: any) {
    this.databaseConnection = connectToDb(databaseConfig);
    return this;
  }

  withStaticFiles(folder: string) {
    this.staticFolder = folder;
    return this;
  }

  run(port: number) {
    if (!this.firebaseInitialized) throw new Error('Firebase admin not initialized');
    if (!this.databaseConnection) throw new Error('Database connection not configured');

    const app = mountApp(this.staticFolder);
    this.databaseConnection.then(() => {
      app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
      });
    });
  }
}

export default new Server();
