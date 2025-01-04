import {AppDataSource} from '@/data-source';
import logger from '@/logger';
import {DataSource} from 'typeorm';

class DatabaseService {
  private dataSource: DataSource | null = null;

  async connect(): Promise<void> {
    try {
      if (!this.dataSource) {
        this.dataSource = AppDataSource;
        await this.dataSource.initialize();
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

  async getEntityManager() {
    const dataSource = this.getDataSource();
    return dataSource.manager;
  }
}

const databaseService = new DatabaseService();
export default databaseService;
