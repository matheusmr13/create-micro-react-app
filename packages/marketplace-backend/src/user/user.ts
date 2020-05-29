import { Column, Entity } from 'ts-datastore-orm';
import dayJs from 'dayjs';
import Auth from '../auth/auth';
import Model from 'base/model';

interface IUser {
  id: string;
  name: string;
  login: string;
  email: string;
  picture?: string;
  githubToken?: string;
  slackToken?: string;
}

@Entity({ kind: 'user' })
class User extends Model {
  @Column()
  public name: string = '';

  @Column({ index: true })
  public login: string = '';

  @Column({ index: true })
  public email: string = '';

  @Column()
  public githubToken: string = '';

  @Column()
  public slackToken: string = '';

  @Column()
  public picture: string = '';

  static async createUser(payload: IUser) {
    const user = User.create({
      ...payload,
      createdAt: dayJs().format(),
    });
    await user.save();
    return user;
  }

  getJWT() {
    return Auth.createToken(this);
  }
}

export default User;
