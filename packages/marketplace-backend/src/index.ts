import express, { NextFunction, Request, Response } from 'express';

import AuthRouter from './auth/router';
import AuthFilter from './auth/filter';

import MicrofrontendRouter from './microfrontend/router';
import ApplicationRouter from './application/router';
import VersionController from './version/router';
import UserRouter from './user/router';

import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', AuthRouter);
app.use('/oauth', AuthRouter);
app.use(AuthFilter);
app.use('/microfrontends', MicrofrontendRouter);
app.use('/applications', ApplicationRouter);
app.use('/versions', VersionController);
app.use('/users', UserRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

const { PORT = 8080 } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
