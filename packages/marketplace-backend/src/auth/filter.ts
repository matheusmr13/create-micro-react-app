import { Request, Response, NextFunction } from 'express';
import Auth from './auth';

const AuthFilter = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url);

  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send();
    return;
  }

  const tokenAuth = Auth.validateToken(authorization);
  if (!tokenAuth) {
    res.status(401).send();
    return;
  }

  res.locals.tokenAuth = tokenAuth;
  next();
};

export default AuthFilter;
