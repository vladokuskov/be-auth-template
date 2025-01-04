import {DataSource} from 'typeorm';

require('dotenv').config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || 'test',
  database: process.env.DB_NAME || 'test',
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
  logging: process.env.DB_LOGGING === 'true' || false,
  entities: ['src/entities/*.entity{.ts,.js}', 'dist/src/entities/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.entity{.ts,.js}', 'dist/src/migrations/*.entity{.ts,.js}'],
  subscribers: [],
});
