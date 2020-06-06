import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import dayJs from 'dayjs';

export enum STATUS {
  NEEDS_APROVAL = 'NEEDS_APROVAL',
  APPROVED = 'APPROVED',
}

interface IVersion {
  name: string;
  microfrontendId: string;
  sha: string;
}

@Entity()
class Version extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string = '';

  @Column()
  public name: string = '';

  @Column()
  public createdAt: string = '';

  @Column()
  public microfrontendId?: string = '';

  @Column()
  public sha: string = '';

  @Column()
  public status: STATUS = STATUS.NEEDS_APROVAL;

  static build(payload: IVersion) {
    const version = Version.create({
      ...payload,
      createdAt: dayJs().format(),
      id: uuidv4(),
    });
    return version;
  }

  async approve() {
    this.status = STATUS.APPROVED;
    await this.save();
    return this;
  }
}
export default Version;
