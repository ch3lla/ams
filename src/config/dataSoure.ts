import { DataSource } from 'typeorm';
import { Student } from '../models/STUDENT';
import { Lecturer } from '../models/LECTURER';
import { Geofence } from '../models/GEOFENCE';
import { Attendance } from '../models/ATTENDANCE';
import { Course } from '../models/COURSE';
import { Department } from '../models/DEPARTMENT';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Set to false in production
  logging: false,
  entities: [Student, Lecturer, Course, Department, Attendance, Geofence],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
