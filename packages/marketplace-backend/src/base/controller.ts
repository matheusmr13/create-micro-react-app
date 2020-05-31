import { Request, Response } from 'express';
import Model from './model';
import { BaseEntity } from 'ts-datastore-orm';
import NotFoundError from './errors/not-found';

class Context<T extends typeof Model> {
  constructor(private req: Request, private res: Response, private classRef: T) {}

  getUser = async () => {
    const user = this.req.locals?.user;
    return user!;
  };

  getInstance = async () => {
    const [instance] = await this.classRef.find(this.req.params.uuid);
    if (!instance) {
      throw new NotFoundError();
    }
    return instance;
  };
}

class Controller<T extends typeof Model> {
  constructor(private classRef: T) {}

  public create = async (req: Request, res: Response) => {
    const [instance] = await this.classRef.create(req.body).save();
    res.json(instance.toJSON());
  };

  public list = async (req: Request, res: Response) => {
    const [instances] = await this.classRef.query().run();
    res.json(instances.map((instance) => instance.toJSON()));
  };

  public withContext(callback: (req: Request, res: Response, context: Context<T>) => void) {
    return async (req: Request, res: Response) => {
      await callback(req, res, new Context(req, res, this.classRef));
    };
  }

  public createInstanceAction(
    callback: (instance: InstanceType<T>, req: Request, res: Response) => Promise<InstanceType<T> | undefined>
  ) {
    return this.withContext(async (req: Request, res: Response, context: Context<T>) => {
      const instance = await context.getInstance();
      const newInstance = await callback(instance, req, res);
      if (!newInstance) {
        res.send();
        return;
      }

      res.json(newInstance.toJSON());
    });
  }

  public createFilteredByList<K extends Exclude<keyof InstanceType<T>, keyof BaseEntity>>(fields: Array<K>) {
    return async (req: Request, res: Response) => {
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

  public read = this.withContext(async (req: Request, res: Response, context: Context<T>) => {
    const instance = await context.getInstance();
    res.json(instance.toJSON());
  });

  public update = this.withContext(async (req: Request, res: Response, context: Context<T>) => {
    let instance = await context.getInstance();
    instance = await instance.update(req.body);
    res.json(instance.toJSON());
  });

  public delete = this.withContext(async (req: Request, res: Response, context: Context<T>) => {
    const instance = await context.getInstance();
    await instance.delete();
    res.json(instance.toJSON());
  });

  public clear = async (req: Request, res: Response) => {
    await this.classRef.clear();
    res.json({});
  };
}

export default Controller;
