import BaseController from 'base/controller';
import User from './user-extra';
import ForbiddenError from 'base/errors/forbidden';

class UserController extends BaseController<typeof User> {
  constructor() {
    super(User);
  }

  public getExtra = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    if (user.id !== req.params.uuid) throw new ForbiddenError();
    const extra = await user.getExtra();
    res.json(extra.toJSON());
  });

  public updateExtra = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    if (user.id !== req.params.uuid) throw new ForbiddenError();
    const extra = await user.getExtra();
    await extra.update(req.body);
    res.json(extra.toJSON());
  });
}

export default new UserController();
