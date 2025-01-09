import {Session} from '@/entities/Session.entity';
import dbService from '@/services/db.service';

class AuthRepository {
  em = dbService.em;

  async createSession(userId: string, expiresAt: Date): Promise<Session> {
    const session = this.em.create(Session, {userId, expiresAt});
    return this.em.save(session);
  }

  async getSession(userId: string): Promise<Session | null> {
    return this.em.findOne(Session, {where: {userId}});
  }

  async removeSession(sessionId: string): Promise<void> {
    await this.em.delete(Session, {id: sessionId});
  }
}

const authRepository = new AuthRepository();
export default authRepository;
