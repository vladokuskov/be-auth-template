import {authConfig} from '@/configs/auth.config';
import {Session} from '@/entities/Session.entity';
import em from '@/managers/entity.manager';

class SessionService {
  get expireTime() {
    // expire 1 month from now
    return new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
  }

  async createSession(userId: string): Promise<Session> {
    let session = await em.findOne(Session, {where: {userId}});

    if (!session) {
      session = em.create(Session, {userId, expiresAt: this.expireTime});
    } else {
      session.expiresAt = this.expireTime;
    }

    return session;
  }
}

const sessionService = new SessionService();
export default sessionService;
