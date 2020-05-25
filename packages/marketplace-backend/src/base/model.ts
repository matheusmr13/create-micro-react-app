import { BaseEntity, Column } from 'ts-datastore-orm';

class Model extends BaseEntity {
  @Column({ index: true })
  public id: string = '';

  @Column({ index: true })
  public createdAt: string = '';

  static async clear() {
    const [instances] = await this.query().run();
    await Promise.all(
      instances.map(async (instance) => {
        await instance.delete();
      })
    );
  }

  async update(payload: any) {
    this.setValues(payload);
    await this.save();
    return this;
  }
}

export default Model;
