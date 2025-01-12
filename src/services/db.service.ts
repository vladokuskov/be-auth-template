import {AppDataSource} from '@/data-source';
import {logger} from '@/logger';
import {DataSource} from 'typeorm';

class DatabaseService {
  public dataSource: DataSource | null = null;

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
}

const databaseService = new DatabaseService();
export default databaseService;
