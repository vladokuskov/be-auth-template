import {PasswordReset} from '@/entities/PasswordReset.entity';
import {logger} from '@/logger';
import em from '@/managers/entity.manager';

const cleanExpiredPasswordResets = async () => {
  try {
    const currentDate = new Date();

    const result = await em.deleteWithCondition(PasswordReset, 'expiresAt < :currentDate', {currentDate});

    logger.info(`Cleaned ${result.affected} expired password resets`);
  } catch (err) {
    logger.error(err);
  }
};

export default cleanExpiredPasswordResets;
