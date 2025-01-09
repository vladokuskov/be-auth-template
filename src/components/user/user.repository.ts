import {CreateUserArgs} from '@/@types/CreateUserArgs';
import {User} from '@/entities/User.entity';
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

  async getUserById(id: string): Promise<User | null> {
    return this.em.findOne(User, {where: {id}});
  }
}

const userRepository = new UserRepository();
export default userRepository;
