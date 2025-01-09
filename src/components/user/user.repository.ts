import {CreateUserArgs} from '@/@types/CreateUserArgs';
import {User} from '@/components/user/user.entity';
import {Session} from '@/entities/Session.entity';
import dbService from '@/services/db.service';

class UserRepository {
  em = dbService.em;

  async createUser({email, password, username}: CreateUserArgs): Promise<User> {
    const user = this.em.create(User, {email, password, username});
    return this.em.save(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, {where: {email}});
  }

  async removeSession(sessionId: string): Promise<void> {
    await this.em.delete(Session, {id: sessionId});
  }
}

const userRepository = new UserRepository();
export default userRepository;
