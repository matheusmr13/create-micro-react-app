import BaseController from 'base/controller';
import User from './user';

class UserController extends BaseController<typeof User> {
  constructor() {
    super(User);
  }

  public getMe = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    res.json(user.toJSON());
  });

  public updateMe = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    await user.update(req.body);
    res.json(user.toJSON());
  });
}

export default new UserController();
