import Model from './model';
import { Column } from 'ts-datastore-orm';

class BasicEntity extends Model {
  @Column({ index: true })
  public id: string = '';

  @Column()
  public name: string = '';

  @Column({ index: true })
  public ownerId: string = '';

  @Column({ index: true })
  public createdAt: string = '';

  constructor() {
    super();
  }
}

export default BasicEntity;
