import {AppDataSource} from '@/data-source';
import logger from '@/logger';
import {DataSource, EntityManager} from 'typeorm';

class DatabaseService {
  private dataSource: DataSource | null = null;
  public em: EntityManager;

  async connect(): Promise<void> {
    try {
      if (!this.dataSource) {
        this.dataSource = AppDataSource;
        await this.dataSource.initialize();
        this.em = this.getDataSource().manager;
        logger.info('Successfully connected to Database');
      }
    } catch (error) {
      logger.error('Failed to connect to Database', error);
      throw error;
    }
  }

  getDataSource(): DataSource {
    if (!this.dataSource || !this.dataSource.isInitialized) {
      throw new Error('Database is not initialized');
    }
    return this.dataSource;
  }
}

const databaseService = new DatabaseService();
export default databaseService;
