import { Column, Entity } from 'ts-datastore-orm';
import { v4 as uuidv4 } from 'uuid';
import dayJs from 'dayjs';
import BasicEntity from 'base/basic-entity';

enum STATUS {
  NEEDS_APROVAL = 'NEEDS_APROVAL',
  APPROVED = 'APPROVED',
}

interface IVersion {
  name: string;
  microfrontendId: string;
  sha: string;
}

@Entity({ kind: 'version' })
class Version extends BasicEntity {
  static STATUS = STATUS;

  @Column({ index: true })
  public microfrontendId?: string = '';

  @Column()
  public sha: string = '';

  @Column({ index: true })
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
