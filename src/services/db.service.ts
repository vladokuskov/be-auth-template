import {dbConfig} from '@/configs/db.config';
import logger from '@/logger';
import {ISchemaGenerator, MikroORM as MikroORMType} from '@mikro-orm/core';
import {MikroORM} from '@mikro-orm/postgresql';
import {TsMorphMetadataProvider} from '@mikro-orm/reflection';

class DatabaseService {
  public orm: MikroORMType | null = null;

  constructor() {
    this.orm = null;
  }

  async connect(): Promise<void> {
    try {
      this.orm = await MikroORM.init({
        // Paths for entities
        entities: ['./dist/app/**/*.entity.js'],
        entitiesTs: ['./src/entities/**/*.entity.ts'],

        // Use types from class in entities
        metadataProvider: TsMorphMetadataProvider,

        // DB Authentication
        user: dbConfig.user,
        password: dbConfig.password,
        dbName: dbConfig.name,
        host: dbConfig.host,
        port: dbConfig.port,
      });

      const generator: ISchemaGenerator = this.orm.getSchemaGenerator();
      await generator.updateSchema();

      logger.info('Successfully connected to Database');
    } catch (err) {
      logger.error(err);
    }
  }

  async getEntityManager() {
    if (!this.orm) {
      throw new Error('ORM has not been initialized');
    }
    return this.orm.em.fork();
  }
}

const databaseService = new DatabaseService();
export default databaseService;
