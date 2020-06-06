import { Request, Response, NextFunction } from 'express';
import FirebaseWrapper from './firebase-wrapper';
import User from './user';

const AuthFilter = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url);

  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send();
    return;
  }

  try {
    const firebaseUser = await FirebaseWrapper.verifyIdToken(authorization);
    req.locals = {
      user: new User(firebaseUser),
    };
    next();
  } catch (e) {
    res.status(401).send();
    return;
  }
};

export default AuthFilter;
