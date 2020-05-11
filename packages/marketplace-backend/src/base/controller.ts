import { Request, Response } from 'express';
import Model from './model';
import { BaseEntity } from 'ts-datastore-orm';

class Controller<T extends typeof Model> {
  constructor(private classRef: T) {}

  public create = async (req: Request, res: Response) => {
    res.status(404).send();
  };

  public list = async (req: Request, res: Response) => {
    const [instances] = await this.classRef.query().run();
    res.json(instances.map((instance) => instance.toJSON()));
  };

  public createFilteredByList<K extends Exclude<keyof InstanceType<T>, keyof BaseEntity>>(fields: Array<K>) {
    return async (req: Request, res: Response) => {
      // await new Promise((resolve) => setTimeout(resolve, 40000));
      const query = this.classRef.query();
      fields.forEach((field) => {
        const fieldString = field.toString();
        const queryParam = req.query[fieldString];
        if (!queryParam) return;
        const valueString = queryParam.toString();

        query.filterAny(fieldString, '=', valueString);
      });
      const [instances] = await query.run();
      res.json(instances.map((microfrontend) => microfrontend.toJSON()));
    };
  }

  public read = async (req: Request, res: Response) => {
    const [instance] = await this.classRef.find(req.params.uuid);
    if (!instance) {
      res.status(404).send();
      return;
    }
    res.json(instance);
  };

  public update = async (req: Request, res: Response) => {
    let [instance] = await this.classRef.find(req.params.uuid);
    if (!instance) {
      res.status(404).send();
      return;
    }
    instance = await instance.update(req.body);
    res.json(instance.toJSON());
  };

  public delete = async (req: Request, res: Response) => {
    res.status(404).send();
  };

  public clear = async (req: Request, res: Response) => {
    const [instances] = await this.classRef.query().run();
    await Promise.all(
      instances.map(async (instance) => {
        await instance.delete();
      })
    );
    res.json({});
  };
}

export default Controller;
