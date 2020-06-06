import { createConnection } from 'typeorm';

const startDatabase = async (config: any) => {
  await createConnection({
    ...config,
    type: 'postgres',
    entities: [__dirname + '/entity/*.js'],
    synchronize: true,
  });
};

export default startDatabase;
