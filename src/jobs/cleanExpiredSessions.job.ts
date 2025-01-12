import {Session} from '@/entities/Session.entity';
import {logger} from '@/logger';
import em from '@/managers/entity.manager';

const cleanExpiredSessionsJob = async () => {
  try {
    const currentDate = new Date();

    const result = await em.deleteWithCondition(Session, 'expiresAt < :currentDate', {currentDate});

    logger.info(`Cleaned ${result.affected} expired sessions`);
  } catch (err) {
    logger.error(err);
  }
};

export default cleanExpiredSessionsJob;
