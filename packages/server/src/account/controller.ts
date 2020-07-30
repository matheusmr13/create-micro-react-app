import BaseController from '../base/controller';
import ForbiddenError from '../base/errors/forbidden';
import User from '../entity/user';

class UserController extends BaseController<typeof User> {
  constructor() {
    super(User);
  }

  public getExtra = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    if (user.id !== req.params.uuid) throw new ForbiddenError();
    const extra = await user.getExtra();
    res.json(extra);
  });

  public updateExtra = this.withContext(async (req, res, context) => {
    const user = await context.getUser();
    if (user.id !== req.params.uuid) throw new ForbiddenError();
    let extra = await user.getExtra();

    extra = User.merge(extra, req.body);

    extra = await extra.save();
    res.json(extra);
  });
}

export default new UserController();
