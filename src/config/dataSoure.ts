import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  username: process.env.DB_USER!,
  password: String(process.env.DB_PASSWORD!),
  database: process.env.DB_NAME!,
  synchronize: true, // Set to false in production
  logging: false,
  entities: ['src/models/**/*.ts']
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.log(process.env.DB_PASSWORD);
    console.error('Error during Data Source initialization:', err);
  });
