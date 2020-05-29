import { Request, Response, NextFunction } from 'express';
import Auth from './auth';
import FirebaseWrapper from './firebase-wrapper';

const AuthFilter = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url);

  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send();
    return;
  }

  try {
    const auth = await FirebaseWrapper.verifyIdToken(authorization);
    req.locals = { auth };
    next();
  } catch (e) {
    res.status(401).send();
    return;
  }
};

export default AuthFilter;
