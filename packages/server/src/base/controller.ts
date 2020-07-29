import { Request, Response } from 'express';
import { DeepPartial, BaseEntity, ObjectType, FindConditions } from 'typeorm';
import NotFoundError from './errors/not-found';

class Context<T extends typeof BaseEntity> {
  constructor(private req: Request, private res: Response, private classRef: T) {}

  getUser = async () => {
    const user = this.req.locals?.user;
    return user!;
  };

  async getInstance(): Promise<InstanceType<T>> {
    let self = this.classRef as any;
    const instance = await self.findOne(this.req.params.uuid);
    if (!instance) {
      throw new NotFoundError();
    }
    return instance;
  }
}

class Controller<T extends typeof BaseEntity> {
  constructor(private classRef: T) {}

  public create = async (req: Request, res: Response) => {
    const props: DeepPartial<T> = req.body;
    const instance = this.classRef.create(props);
    await instance.save();
    res.json(instance);
  };

  public list = async (req: Request, res: Response) => {
    const instances = await this.classRef.find();
    res.json(instances.map((instance) => instance));
  };

  public withContext(callback: (req: Request, res: Response, context: Context<T>) => void) {
    return async (req: Request, res: Response) => {
      await callback(req, res, new Context(req, res, this.classRef));
    };
  }

  public createInstanceAction(
    callback: (instance: InstanceType<T>, req: Request, res: Response) => Promise<T | undefined>
  ) {
    return this.withContext(async (req: Request, res: Response, context: Context<T>) => {
      const instance = await context.getInstance();
      const newInstance = await callback(instance, req, res);
      if (!newInstance) {
        res.send();
        return;
      }

      res.json(newInstance);
    });
  }

  public createFilteredByList<K extends Exclude<keyof InstanceType<T>, keyof BaseEntity>>(fields: Array<K>) {
    return async (req: Request, res: Response) => {
      const query = this.classRef.createQueryBuilder('entity');
      fields.forEach((field) => {
        const fieldString = field.toString();
        const queryParam = req.query[fieldString];
        if (!queryParam) return;
        const valueString = queryParam.toString();
        // agg[fieldString] = valueString;

        query.andWhere(`entity.${fieldString} = :${fieldString}`, { [fieldString]: valueString });
      });

      // this.classRef.find({ where });
      const instances = await query.getMany();
      res.json(instances.map((microfrontend) => microfrontend));
    };
  }

  public read = this.withContext(async (req: Request, res: Response, context: Context<T>) => {
    const instance = await context.getInstance();
    res.json(instance);
  });

  public update = this.withContext(async (req: Request, res: Response, context: Context<T>) => {
    let instance: BaseEntity = await context.getInstance();
    instance = this.classRef.merge(instance, req.body);
    await instance.save();
    res.json(instance);
  });

  public delete = this.withContext(async (req: Request, res: Response, context: Context<T>) => {
    const instance = await context.getInstance();
    await instance.remove();
    res.json(instance);
  });

  public clear = async (req: Request, res: Response) => {
    await this.classRef.clear();
    res.json({});
  };
}

export default Controller;
