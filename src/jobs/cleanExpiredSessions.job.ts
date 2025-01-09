import {Session} from '@/entities/Session.entity';
import logger from '@/logger';
import databaseService from '@/services/db.service';

const cleanExpiredSessionsJob = async () => {
  try {
    const currentDate = new Date();

    const result = await databaseService.em
      .createQueryBuilder()
      .delete()
      .from(Session)
      .where('expiresAt < :currentDate', {currentDate})
      .execute();

    logger.info(`Cleaned ${result.affected} expired sessions`);
  } catch (err) {
    logger.error(err);
  }
};

export default cleanExpiredSessionsJob;
