import Model from './model';
import { Column } from 'ts-datastore-orm';

class BasicEntity extends Model {
  @Column()
  public name: string = '';

  @Column({ index: true })
  public ownerId: string = '';

  @Column({ index: true })
  public createdAt: string = '';
}

export default BasicEntity;
