import {authConfig} from '@/configs/auth.config';
import {Session} from '@/entities/Session.entity';
import {User} from '@/entities/User.entity';
import em from '@/managers/entity.manager';
import bcrypt from 'bcrypt';
import {NextFunction, Request, RequestHandler, Response} from 'express';

class AuthController {
  signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {email, username, password}: Record<string, string> = req.body;

    try {
      const existingUser = await em.findOne(User, {where: {email}});
      if (existingUser) {
        res.status(400).send({error: 'User already exists'});
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = em.create(User, {email, password: hashedPassword, username});
      await em.save(user);

      // expire 1 month from now
      const expiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
      const session = em.create(Session, {userId: user.id, expiresAt});
      await em.save(session);

      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: false,
        expires: session.expiresAt,
        sameSite: 'none',
      });

      res.status(200).send({message: 'User created'});
    } catch (err) {
      next(err);
    }
  };

  login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password}: Record<string, string> = req.body;

    try {
      const existingUser = await em.findOne(User, {where: {email}});
      if (!existingUser) {
        res.status(404).send({error: 'Wrong credentials'});
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordValid) {
        res.status(400).send({error: 'Wrong credentials'});
        return;
      }

      const existedSession = await em.findOne(Session, {where: {userId: existingUser.id}});
      if (existedSession) await em.delete(Session, {id: existedSession.id});

      // expire 1 month from now
      const expiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
      const session = em.create(Session, {userId: existingUser.id, expiresAt});
      await em.save(session);

      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: false,
        expires: session.expiresAt,
        sameSite: 'none',
      });

      res.status(200).send({message: 'User logged in'});
    } catch (err) {
      next(err);
    }
  };
}
const authController: AuthController = new AuthController();
export default authController;
