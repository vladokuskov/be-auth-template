import {EmailTemplate} from '@/@types/EmailTemplate';
import {authConfig} from '@/configs/auth.config';
import {MagicLink} from '@/entities/MagicLink.entity';
import {Session} from '@/entities/Session.entity';
import {User} from '@/entities/User.entity';
import {generateUniqueToken} from '@/helpers/generaeUniqueToken';
import em from '@/managers/entity.manager';
import emailService from '@/services/email.service';
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
        secure: process.env.NODE_ENV === 'development',
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
        secure: process.env.NODE_ENV === 'development',
        expires: session.expiresAt,
        sameSite: 'none',
      });

      res.status(200).send({message: 'User logged in'});
    } catch (err) {
      next(err);
    }
  };

  // Magic link auth
  createMagicLink: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {email}: Record<string, string> = req.body;

    const message = 'Magic link created';
    try {
      const existingUser = await em.findOne(User, {where: {email}});

      if (!existingUser) {
        res.status(200).send({message});
        return;
      }

      const magicToken = generateUniqueToken();

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expiry in 15 minutes

      const magicLink = new MagicLink();
      magicLink.userId = existingUser.id;
      magicLink.token = magicToken;
      magicLink.expiresAt = expiresAt;
      magicLink.used = false;

      await em.save(magicLink);

      await emailService.send(EmailTemplate.MAGIC_LINK, {magicToken, to: email});

      res.status(200).send({message});
    } catch (err) {
      next(err);
    }
  };

  verifyMagicLink: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {token}: Record<string, string> = req.body;

    try {
      const magicLink = await em.findOne(MagicLink, {where: {token}});

      if (!magicLink) {
        res.status(404).send({message: 'Magic link not found'});
        return;
      }

      if (magicLink.isExpired()) {
        res.status(400).send({message: 'Magic link has expired'});
        return;
      }

      if (magicLink.used) {
        res.status(400).send({message: 'Magic link has already been used'});
        return;
      }

      const existingUser = await em.findOne(User, {where: {id: magicLink.userId}});

      if (!existingUser) {
        res.status(404).send({message: 'User not found'});
        return;
      }

      magicLink.used = true;
      await em.save(magicLink);

      const existedSession = await em.findOne(Session, {where: {userId: existingUser.id}});
      if (existedSession) await em.delete(Session, {id: existedSession.id});

      const expiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
      const session = em.create(Session, {userId: existingUser.id, expiresAt});
      await em.save(session);

      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
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
