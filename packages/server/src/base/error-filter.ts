import { Request, Response, NextFunction } from 'express';
import RequestError from './errors/request-error';

const ErrorFilter = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  if (err instanceof RequestError) {
    res.status(err.statusCode).send();
    return;
  }
  res.status(500);
};
export default ErrorFilter;
