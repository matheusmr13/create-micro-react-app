import BaseController from 'base/controller';
import { Request, Response } from 'express';
import User from './user';

class UserController extends BaseController<typeof User> {
  constructor() {
    super(User);
  }

  public getMe = async (req: Request, res: Response) => {
    const { id } = res.locals.tokenAuth;
    const [user] = await User.find(id);

    if (!user) {
      res.status(500).send();
      return;
    }

    res.json(user.toJSON());
  };

  public updateMe = async (req: Request, res: Response) => {
    const { id } = res.locals.tokenAuth;
    const [user] = await User.find(id);

    if (!user) {
      res.status(500).send();
      return;
    }

    await user.update(req.body);
    res.json(user.toJSON());
  };
}

export default new UserController();
