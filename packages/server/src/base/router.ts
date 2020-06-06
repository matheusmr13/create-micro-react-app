import { Request, Response, NextFunction } from 'express';

export const asyncRequestHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  fn(req, res, next).catch(next);
