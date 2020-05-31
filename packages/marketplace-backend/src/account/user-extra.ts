import { Column, Entity } from 'ts-datastore-orm';
import Model from 'base/model';

interface IUserExtra {
  id: string;
  githubToken?: string;
  slackToken?: string;
}

@Entity({ kind: 'userExtra' })
class UserExtra extends Model {
  @Column()
  public githubToken: string = '';

  @Column()
  public slackToken: string = '';

  static async createUserExtra(payload: IUserExtra) {
    const user = UserExtra.create({
      ...payload,
    });
    await user.save();
    return user;
  }
}

export default UserExtra;
