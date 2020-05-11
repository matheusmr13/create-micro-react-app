import { BaseEntity, Column } from 'ts-datastore-orm';

class Model extends BaseEntity {
  async update(payload: any) {
    this.setValues(payload);
    await this.save();
    return this;
  }
}

export default Model;
