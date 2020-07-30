import { Column, Entity, PrimaryColumn, BaseEntity } from 'typeorm';

interface IUser {
  id: string;
  githubToken?: string;
  slackToken?: string;
}

@Entity()
class User extends BaseEntity {
  @PrimaryColumn()
  public id: string = '';

  @Column()
  public githubToken: string = '';

  @Column()
  public slackToken: string = '';

  static async createUser(payload: IUser) {
    const user = User.create({
      ...payload,
    });
    await user.save();
    return user;
  }
}

export default User;
