import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';

export enum DESTINATION_TYPE {
  GITHUB_PAGES = 'GITHUB_PAGES',
  AWS_S3 = 'AWS_S3',
}

@Entity()
class Destination extends BaseEntity {
  @PrimaryColumn('uuid')
  public id: string = '';

  @Column()
  public type: DESTINATION_TYPE = DESTINATION_TYPE.AWS_S3;

  @Column('simple-json')
  public config: any = {};
}

export default Destination;
