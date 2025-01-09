import {Session} from '@/entities/Session.entity';
import dbService from '@/services/db.service';

class AuthRepository {
  em = dbService.em;

  async createSession(userId: string, expiresAt: Date): Promise<Session> {
    const session = this.em.create(Session, {userId, expiresAt});
    return this.em.save(session);
  }

  async getSessionById(userId: string): Promise<Session | null> {
    return this.em.findOne(Session, {where: {userId}});
  }

  async getSessionByUserId(userId: string): Promise<Session | null> {
    return this.em.findOne(Session, {where: {userId}});
  }

  async removeSession(sessionId: string): Promise<void> {
    await this.em.delete(Session, {id: sessionId});
  }

  async updateSession(sessionId: string, data: Partial<Session>) {
    return await this.em.update(Session, {id: sessionId}, data);
  }
}

const authRepository: AuthRepository = new AuthRepository();
export default authRepository;
