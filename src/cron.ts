import cleanExpiredPasswordResets from '@/jobs/cleanExpiredPasswordResets.job';
import cleanExpiredSessionsJob from '@/jobs/cleanExpiredSessions.job';
import {logger} from '@/logger';
import cronInstance, {schedule} from 'node-cron';

type CronInstance = {schedule: typeof schedule};

export class Cron {
  private cron: CronInstance = cronInstance;

  public async run() {
    logger.info('Running cron');

    // Clean expired sessions every hour
    this.cron.schedule('0 * * * *', cleanExpiredSessionsJob);

    // Clean expired password resets at 5 AM
    this.cron.schedule('0 5 * * *', cleanExpiredPasswordResets);
  }
}

const cron = new Cron();
export default cron;
