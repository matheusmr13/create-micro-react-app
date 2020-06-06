import { Column, Entity, PrimaryColumn, BaseEntity } from 'typeorm';

interface IUserExtra {
  id: string;
  githubToken?: string;
  slackToken?: string;
}

@Entity()
class UserExtra extends BaseEntity {
  @PrimaryColumn()
  public id: string = '';

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
