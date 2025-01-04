import cleanExpiredSessionsJob from '@/jobs/cleanExpiredSessionsJob';
import logger from '@/logger';
import cronInstance, {schedule} from 'node-cron';

type CronInstance = {schedule: typeof schedule};

export class Cron {
  private cron: CronInstance = cronInstance;

  public async run() {
    logger.info('Running cron');
    // Clean expired sessions every hour
    this.cron.schedule('0 * * * *', cleanExpiredSessionsJob);
  }
}

const cron = new Cron();
export default cron;
