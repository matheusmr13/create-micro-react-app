import BaseController from 'base/controller';
import ForbiddenError from 'base/errors/forbidden';
import UserExtra from '../entity/user-extra';

class UserController extends BaseController<typeof UserExtra> {
  constructor() {
    super(UserExtra);
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

    extra = UserExtra.merge(extra, req.body);

    console.info(extra);
    extra = await extra.save();
    console.info(extra);
    res.json(extra);
  });
}

export default new UserController();
