import {Session} from '@/entities/Session.entity';
import {User} from '@/entities/User.entity';

declare global {
  namespace Express {
    interface Request {
      session?: Session;
      user?: User;
    }
  }
}
