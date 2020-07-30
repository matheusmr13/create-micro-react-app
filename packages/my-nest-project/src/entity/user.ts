import { Column, Entity, PrimaryColumn, BaseEntity } from 'typeorm';

@Entity()
class User extends BaseEntity {
  @PrimaryColumn()
  public id: string;

  @Column()
  public githubToken: string = '';

  @Column()
  public slackToken: string = '';

  constructor(id: string) {
    super();
    this.id = id;
  }
}

export default User;
