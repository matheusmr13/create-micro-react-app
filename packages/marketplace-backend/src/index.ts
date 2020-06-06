import app from './server';
import { createConnection } from 'typeorm';
createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'typeormtest',
  password: 'password',
  database: 'typeormtest',
  entities: [__dirname + '/entity/*.js'],
  synchronize: true,
})
  .then((connection) => {
    const { PORT = 8080 } = process.env;
    const server = app.listen(PORT, () => {
      console.log(`Example app listening at http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));
