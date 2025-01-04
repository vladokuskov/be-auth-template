import {authConfig} from '@/configs/auth.config';
import {Session} from '@/entities/Session.entity';
import {User} from '@/entities/User.entity';
import validate from '@/middlewares/validation.middleware';
import {loginSchema, signUpSchema} from '@/schemas/auth.schema';
import dbService from '@/services/db.service';
import bcrypt from 'bcrypt';
import express, {NextFunction, Request, Response, Router} from 'express';

const authController: Router = express.Router();

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const {email, username, password}: Record<string, string> = req.body;

  try {
    const em = await dbService.getEntityManager();

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

    res.status(200).send({message: 'User created', session});
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const {email, password}: Record<string, string> = req.body;

  try {
    const em = await dbService.getEntityManager();

    const existingUser = await em.findOne(User, {where: {email}});
    if (!existingUser) {
      res.status(404).send({error: 'User not found'});
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      res.status(400).send({error: 'Wrong credentials'});
      return;
    }

    const existedSession = await em.findOne(Session, {where: {userId: existingUser.id}});
    if (existedSession) await em.remove(existedSession);

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

authController.post('/signup', validate(signUpSchema), signup);
authController.post('/login', validate(loginSchema), login);

export default authController;
